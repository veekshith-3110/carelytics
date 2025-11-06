"""
Script to download Mediterranean Plants dataset from Kaggle using kagglehub
and convert it to a JSON format that can be used by the plant recognition feature.
"""

import kagglehub
import json
import os
from pathlib import Path

def download_mediterranean_plants_dataset():
    """Download the Mediterranean Plants dataset from Kaggle"""
    print("Downloading Mediterranean Plants dataset from Kaggle...")
    
    # Download latest version
    path = kagglehub.dataset_download("ammarmoustafa/mediterranean-plants")
    
    print(f"Path to dataset files: {path}")
    
    # The dataset path will contain the downloaded files
    dataset_path = Path(path)
    
    # List all files in the dataset
    print("\nFiles in dataset:")
    for file_path in dataset_path.rglob("*"):
        if file_path.is_file():
            print(f"  - {file_path.relative_to(dataset_path)}")
    
    return dataset_path

def process_dataset_to_json(dataset_path):
    """Process the dataset and convert to JSON format"""
    dataset_path = Path(dataset_path)
    
    # Look for common dataset file patterns
    json_files = list(dataset_path.rglob("*.json"))
    csv_files = list(dataset_path.rglob("*.csv"))
    txt_files = list(dataset_path.rglob("*.txt"))
    
    plants_data = []
    
    # Try to read JSON files first
    if json_files:
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        plants_data.extend(data)
                    elif isinstance(data, dict):
                        plants_data.append(data)
            except Exception as e:
                print(f"Error reading {json_file}: {e}")
    
    # Try to read CSV files
    if csv_files and not plants_data:
        import csv
        for csv_file in csv_files:
            try:
                with open(csv_file, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    plants_data.extend(list(reader))
            except Exception as e:
                print(f"Error reading {csv_file}: {e}")
    
    # Save processed data
    output_path = Path(__file__).parent.parent / "lib" / "mediterranean_plants_data.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            "dataset_path": str(dataset_path),
            "plants": plants_data,
            "total_plants": len(plants_data)
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\nProcessed dataset saved to: {output_path}")
    print(f"Total plants found: {len(plants_data)}")
    
    return output_path

if __name__ == "__main__":
    try:
        # Download dataset
        dataset_path = download_mediterranean_plants_dataset()
        
        # Process and save as JSON
        output_path = process_dataset_to_json(dataset_path)
        
        print("\n✅ Dataset download and processing completed successfully!")
        print(f"📁 Dataset location: {dataset_path}")
        print(f"📄 Processed JSON: {output_path}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

