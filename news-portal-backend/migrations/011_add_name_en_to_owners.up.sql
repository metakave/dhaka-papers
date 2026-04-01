-- Migration: Add name_en to owners table
ALTER TABLE owners ADD COLUMN name_en VARCHAR(255);

-- Update generic existing users if any (Staff Reporter, etc.)
UPDATE owners SET name_en = 'Staff Reporter' WHERE name = 'নিজস্ব প্রতিবেদক';
UPDATE owners SET name_en = 'Staff Reporter, Dhaka' WHERE name = 'নিজস্ব প্রতিবেদক, ঢাকা';
UPDATE owners SET name_en = 'Online Desk' WHERE name = 'অনলাইন ডেস্ক';
UPDATE owners SET name_en = 'Special Correspondent' WHERE name = 'বিশেষ সংবাদদাতা';
UPDATE owners SET name_en = 'District Correspondent' WHERE name = 'জেলা প্রতিনিধি';
UPDATE owners SET name_en = 'Arifuzzaman Tuhin' WHERE name = 'আরিফুজ্জামান তুহিন';
