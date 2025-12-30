# Scope Expansion: Health & Nutrition Tracking

This document outlines the expanded scope to include comprehensive health tracking beyond fitness/workouts.

## New Features

### 1. Voice-Enabled Meal Logging
- **Voice input** for meal entries (speech-to-text)
- Natural language parsing of food items and quantities
- Quick meal entry on mobile without typing

### 2. Nutrition Tracking (Calories & Macros)
- **Calories** tracking
- **Macros** tracking:
  - Protein
  - Carbohydrates
  - Fats
  - Fiber (optional)
- Daily nutrition summaries
- Macro targets/goals
- Integration with meal logging

### 3. Medication & Supplement Tracking
- **Medications** logging:
  - Medication name
  - Dosage
  - Frequency
  - Time taken
- **Vitamins/Supplements** tracking:
  - Supplement name
  - Dosage
  - Frequency
  - Time taken
- Reminders/notifications (optional)
- History tracking

### 4. Health Profile
- **Blood Work Results**:
  - Test date
  - Test type
  - Results/values
  - Reference ranges
  - Trends over time
- **Medical History**:
  - Conditions
  - Surgeries
  - Allergies
  - Family history (optional)
  - Notes

## Architecture Implications

### Database Schema Additions

#### Nutrition Tables
```prisma
model NutritionEntry {
  id            String   @id @default(cuid())
  userId        String
  date          DateTime @default(now())
  mealType      MealType // breakfast, lunch, dinner, snack
  foodItems     Json     // Array of food items with quantities
  calories      Float?
  protein       Float?   // grams
  carbs         Float?   // grams
  fats          Float?   // grams
  fiber         Float?   // grams
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  
  @@index([userId, date])
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
  OTHER
}
```

#### Medication/Supplement Tables
```prisma
model Medication {
  id            String   @id @default(cuid())
  userId        String
  name          String
  dosage        String   // e.g., "10mg", "1 tablet"
  frequency     String   // e.g., "daily", "twice daily", "as needed"
  startDate     DateTime?
  endDate       DateTime?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  logs          MedicationLog[]
  
  @@index([userId])
}

model MedicationLog {
  id            String   @id @default(cuid())
  medicationId  String
  userId        String
  takenAt       DateTime @default(now())
  dosage        String?
  notes         String?
  
  medication    Medication @relation(fields: [medicationId], references: [id])
  user          User       @relation(fields: [userId], references: [id])
  
  @@index([userId, takenAt])
  @@index([medicationId])
}

model Supplement {
  id            String   @id @default(cuid())
  userId        String
  name          String
  dosage        String
  frequency     String
  startDate     DateTime?
  endDate       DateTime?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  logs          SupplementLog[]
  
  @@index([userId])
}

model SupplementLog {
  id            String   @id @default(cuid())
  supplementId  String
  userId        String
  takenAt       DateTime @default(now())
  dosage        String?
  notes         String?
  
  supplement    Supplement @relation(fields: [supplementId], references: [id])
  user          User       @relation(fields: [userId], references: [id])
  
  @@index([userId, takenAt])
  @@index([supplementId])
}
```

#### Health Profile Tables
```prisma
model BloodWorkResult {
  id            String   @id @default(cuid())
  userId        String
  testDate      DateTime
  testType      String   // e.g., "Complete Blood Count", "Lipid Panel"
  testName      String   // Specific test name
  value         Float?
  unit          String?  // e.g., "mg/dL", "mmol/L"
  referenceRange String? // e.g., "70-100 mg/dL"
  flag          String?  // "high", "low", "normal"
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  
  @@index([userId, testDate])
  @@index([userId, testType])
}

model MedicalHistory {
  id            String   @id @default(cuid())
  userId        String
  category      String   // "condition", "surgery", "allergy", "family_history"
  name          String
  description   String?
  startDate     DateTime?
  endDate       DateTime?
  severity      String?  // "mild", "moderate", "severe"
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  
  @@index([userId, category])
}
```

### User Model Updates
```prisma
model User {
  // ... existing fields
  
  // Nutrition
  nutritionEntries  NutritionEntry[]
  nutritionGoals    NutritionGoals?  // Optional goals/targets
  
  // Medications & Supplements
  medications       Medication[]
  supplements       Supplement[]
  
  // Health Profile
  bloodWorkResults  BloodWorkResult[]
  medicalHistory    MedicalHistory[]
}

model NutritionGoals {
  id            String   @id @default(cuid())
  userId        String   @unique
  calories      Int?
  protein       Float?   // grams per day
  carbs         Float?   // grams per day
  fats          Float?   // grams per day
  fiber         Float?   // grams per day
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
}
```

## Technology Considerations

### Voice Input (Speech-to-Text)
- **Browser Speech Recognition API** (Web Speech API)
- **Pros**: No backend needed, works offline (with limitations)
- **Cons**: Browser support varies, accuracy may vary
- **Alternative**: Cloud API (Google Cloud Speech, AWS Transcribe) - requires API keys

### Food Database/Nutrition Data
- **Options**:
  - USDA FoodData Central API (free, public)
  - Nutritionix API (freemium)
  - Open Food Facts API (free, crowd-sourced)
  - Custom database (manually entered foods)
- **Recommendation**: Start with USDA API + custom entries, expand as needed

### Natural Language Processing for Meals
- Parse voice/text input: "2 eggs and toast" → structured data
- Could use simple parsing rules initially, or integrate NLP library
- Examples:
  - "2 eggs scrambled" → eggs: 2
  - "chicken breast 6oz" → chicken breast: 6 oz
  - "protein shake with banana" → protein shake: 1, banana: 1

## UI/UX Considerations

### Mobile-First Data Entry
- **Voice input button** - Large, easy to tap
- **Quick entry forms** - Pre-filled common foods
- **Barcode scanning** (future) - For packaged foods
- **Meal templates** - Save common meals
- **Copy previous day** - Quick entry for similar days

### Medication/Supplement Logging
- **Quick log buttons** - "Take Now" buttons
- **Schedule view** - See what to take and when
- **History list** - Simple chronological list
- **Edit/delete** - Correct mistakes easily

### Health Profile Views
- **Blood work trends** - Chart showing values over time
- **Medical history list** - Organized by category
- **Entry forms** - Simple forms for adding new data
- **Export/print** - For sharing with healthcare providers

## Integration with Existing Features

### Daily Check-In
- Could include medication/supplement taken today
- Nutrition summary for the day
- Overall wellness score

### Analytics
- Nutrition trends (calories, macros over time)
- Correlation analysis (nutrition vs. workout performance)
- Medication adherence tracking
- Blood work trends and visualizations

### Recommendations
- Nutrition recommendations based on workout intensity
- Meal timing suggestions
- Supplement reminders

## Security & Privacy

- **Health data is highly sensitive** - HIPAA considerations (even for personal use)
- **Encrypted storage** - Ensure database encryption at rest
- **Secure authentication** - Session-based auth already planned
- **Data export** - Allow users to export all data
- **Backup strategy** - Regular backups of health data

## Implementation Phases

### Phase 4: Nutrition Tracking (After Phase 3)
- Basic meal logging
- Voice input for meals
- Calorie/macro tracking
- Nutrition database integration
- Daily nutrition summaries

### Phase 5: Medications & Supplements
- Medication/supplement definitions
- Logging interface
- History tracking
- Simple reminders (optional)

### Phase 6: Health Profile
- Blood work entry and viewing
- Medical history management
- Trend visualizations
- Export capabilities

## API Endpoints Needed

### Nutrition
- `POST /api/nutrition/entries` - Log meal
- `GET /api/nutrition/entries` - Get nutrition entries
- `GET /api/nutrition/summary` - Daily/weekly summaries
- `POST /api/nutrition/goals` - Set nutrition goals
- `GET /api/nutrition/foods/search` - Search food database

### Medications/Supplements
- `POST /api/medications` - Add medication
- `GET /api/medications` - List medications
- `POST /api/medications/:id/log` - Log medication taken
- `GET /api/medications/logs` - Get medication logs
- (Similar for supplements)

### Health Profile
- `POST /api/health/blood-work` - Add blood work result
- `GET /api/health/blood-work` - Get blood work results
- `POST /api/health/medical-history` - Add medical history entry
- `GET /api/health/medical-history` - Get medical history
- `GET /api/health/blood-work/trends` - Get trends for specific test

## Challenges & Considerations

1. **Food database** - Need reliable nutrition data source
2. **Voice recognition accuracy** - May require correction/edit interface
3. **Natural language parsing** - Complex, may need iterative improvement
4. **Data volume** - More data to store and query efficiently
5. **Privacy concerns** - Health data requires extra security measures
6. **Mobile performance** - More features = larger app, need optimization
7. **Complexity** - App becomes more complex, maintain simplicity in UI

## Recommendations

1. **Start with nutrition** - Most aligned with fitness goals
2. **Simple voice input first** - Use Web Speech API, improve later
3. **Manual food entry initially** - Add database integration progressively
4. **Medications/supplements later** - Focus on fitness + nutrition first
5. **Health profile last** - Most complex, least frequently used
6. **Maintain mobile-first** - All new features optimized for mobile entry
7. **Progressive enhancement** - Core features work without advanced features

---

*This scope expansion maintains the mobile-first data ingestion focus while adding comprehensive health tracking capabilities*


