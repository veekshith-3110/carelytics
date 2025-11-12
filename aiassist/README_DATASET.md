# Mediterranean Plants Dataset Integration

This project integrates the Mediterranean Plants dataset from Kaggle (`ammarmoustafa/mediterranean-plants`) into the plant recognition feature.

## Setup Instructions

### 1. Install Python Dependencies

First, make sure you have Python 3.7+ installed. Then install the required package:

```bash
pip install -r requirements.txt
```

### 2. Configure Kaggle API (Optional but Recommended)

If you haven't already, you'll need to set up Kaggle API credentials:

1. Go to https://www.kaggle.com/account
2. Scroll down to "API" section
3. Click "Create New API Token" - this downloads `kaggle.json`
4. Place `kaggle.json` in your home directory:
   - **Windows**: `C:\Users\<YourUsername>\.kaggle\kaggle.json`
   - **Linux/Mac**: `~/.kaggle/kaggle.json`

### 3. Download the Dataset

Run the download script:

```bash
python scripts/download_dataset.py
```

This script will:
- Download the latest version of the Mediterranean Plants dataset from Kaggle
- Process the dataset files
- Convert it to JSON format
- Save it to `lib/mediterranean_plants_data.json`

### 4. Verify Integration

After running the script, the dataset will be automatically available through:
- API endpoint: `/api/mediterranean-plants`
- Plant recognition feature will use the dataset when recognizing plants

## Dataset Information

- **Dataset**: ammarmoustafa/mediterranean-plants
- **Source**: Kaggle
- **Purpose**: Enhance plant recognition with Mediterranean plant species
- **Location**: Downloaded to Kaggle cache, processed data in `lib/mediterranean_plants_data.json`

## Usage in Code

The dataset is automatically loaded when using the plant recognition feature:

```typescript
import { recognizePlantFromImage } from '@/lib/medicinalPlantsDataset'

// The function will automatically use the Mediterranean plants dataset
const result = await recognizePlantFromImage(imageData, 'en')
```

## Troubleshooting

### Dataset Not Found Error

If you see "Dataset not found" errors:
1. Make sure you've run `python scripts/download_dataset.py`
2. Check that `lib/mediterranean_plants_data.json` exists
3. Verify Kaggle API credentials are set up correctly

### Permission Errors

If you get permission errors:
- Make sure the `lib/` directory is writable
- Check that you have internet connection to download from Kaggle

### API Route Not Working

If the API route returns empty data:
- Ensure the Next.js development server is running
- Check the browser console for errors
- Verify the JSON file was created successfully

## Notes

- The dataset is cached after first download
- The script processes common file formats (JSON, CSV, TXT)
- Plant recognition uses both the existing medicinal plants database and the Mediterranean plants dataset

