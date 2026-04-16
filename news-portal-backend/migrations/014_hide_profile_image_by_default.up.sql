ALTER TABLE owners ALTER COLUMN hide_profile_image SET DEFAULT TRUE;
UPDATE owners SET hide_profile_image = TRUE WHERE profile_image IS NULL OR profile_image = '';
