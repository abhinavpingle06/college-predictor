import pandas as pd
import os
import json


base_path = "../../public/data"

og_datasets = {}
cleaned_datasets = []
# IN THIS FORMAT WE WILL STORE
# datasets = {
#    "GUJCET": [...],
#    "JEE": [...],
# }

def load_data():
    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        if os.path.isdir(folder_path):
            for file in os.listdir(folder_path):
                if file.endswith(".json") and file != "scholarship_data.json" :
                    file_path = os.path.join(folder_path, file)
                    with open(file_path, "r", encoding="utf-8") as f:
                        if folder in ["JEE", "NEET", "NEETUG"]:
                            # Case for JEE categiry issue
                            data = json.load(f)
                            category = os.path.splitext(file)[0]
                            for obj in data:
                                obj["category"] = category 
                                if folder == "NEET" or folder == "NEETUG":
                                    obj["exam"] = folder

                            if folder not in og_datasets:
                                og_datasets[folder] = []
                            og_datasets[folder].extend(data)

                        elif folder in ["KCET", "MHTCET", "TNEA", "TSEAPERT"]:
                            # Case for Other exams
                            data = json.load(f)
                            exam = folder
                            for obj in data:
                                obj["exam"] = exam
                            if folder not in og_datasets:
                                og_datasets[folder] = []

                            og_datasets[folder].extend(data)

                        else:
                            og_datasets[folder] = json.load(f)
    
    # print(datasets.keys())

def unique_cols(dataset):
    all_cols = set()

    # Dataset pattern -> {1key:[{v1},{v2},....],2key:[{v1},{v2},....]}
    for key, value in dataset.items():
        for obj in value:
            all_cols.update(obj.keys())

    # print(all_cols)
    return all_cols

def standardized_col(dataset):
    column_Mapping = {
        "College ID": "college_id",
        "Institute ID" : "college_id",
        "Institute Code":"college_id",
        "inst_code":"college_id",

        "Institute": "college_name",
        "College Name": "college_name",
        "institute_name": "college_name",

        "AISHE Code":"aishe_code",
        "NIRF Ranking":"nirf_ranking",
        "AF Hierarchy":"af_hierarchy",

        "College Type": "college_type",
        "Type of College": "college_type",
        "college_type": "college_type",
        "Management Type" : "college_type",

        "College Rank":"college_rank",

        "Total Seats":"total_seats",

        "Exam":"exam",

        "Course": "course_name",
        "Academic Program Name": "course_name",
        "branch_name": "course_name",
        "branch_code":"course_name",

        "Program":"program_name",
        "Course Type":"program_name",

        "Category": "category",
        "category": "category",
        "Seat Type": "category",
        "Category_Key":"category",

        "PWD":"is_pwd",
        "is_PWD":"is_pwd",

        "Closing Rank": "closing_rank",
        "closing_rank": "closing_rank",
        "closing_marks": "closing_mark",
        "Cutoff Marks": "closing_mark",

        "Opening Rank": "opening_rank",

        "Course Fees (per year)": "fees",
        "tuition_fee": "fees",
        
        "Median Salary":"expected_salary",
        "Salary Tier":"expected_salary",
        "Expected Salary":"expected_salary",
        #"Medical Stipend":"expected_salary",
      
    }

    standardized_data = []

    for exam_name, value in dataset.items():
        for obj in value:
            new_obj = {}
            for col_key,col_value in obj.items():
                standardized_key = column_Mapping.get(col_key, col_key.lower().replace(" ", "_"))
                new_obj[standardized_key] = col_value
            new_obj["exam"] = exam_name
            standardized_data.append(new_obj)
    
    # print(standardized_data)
    col_name = set()
    for obj in standardized_data:
        col_name.update(obj.keys())
    # print(col_name)
    
    return standardized_data , list(col_name)

def cleaning_col(dataset_array, final_cols):
    cleaned_dataset = []

    for obj in dataset_array:
        cleaned_obj = {}
        for col in final_cols:
            cleaned_obj[col] = obj.get(col,None)
        cleaned_dataset.append(cleaned_obj)

    return cleaned_dataset

if __name__ == "__main__":

    load_data()
    og_colummns = unique_cols(og_datasets)
    standardized_dataset, final_cols = standardized_col(og_datasets)
    cleaned_dataset = cleaning_col(standardized_dataset,final_cols)

    df = pd.DataFrame(cleaned_dataset)
    # df.to_excel("output.xlsx", index=False)

    # print("Excel file created")
    with open("cleaned_college_data.json", "w", encoding="utf-8") as f:
        json.dump(cleaned_dataset, f, indent=2, ensure_ascii=False)

    print("Cleaned JSON saved")



