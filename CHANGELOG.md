# Changelog

## [2026-06-02]
- **Contact Page Information Update**:
  - Hid physical location and phone numbers on the Contact Us page, displaying only the official email address block.
- **Live Server Code Synchronization (Strategy B - Full Mirror)**:
  - Performed a full synchronization from the live server (`ubuntu@180.94.20.68:/home/ubuntu/news_portal/`) using `rsync` over SSH.
  - Successfully backed up the pre-sync local repository state to `/Users/musfiqurtuhin/Downloads/news_portal_pre_sync_backup/`.
  - Mirrored all files including Git metadata (`.git`), source files, and environment configs to match the running production source of truth.
  - Restored local-only configurations and files as required for a smooth development workflow.

## [2026-05-11]
- **Frontend & CMS News Briefs (সংবাদ সংক্ষেপ) Custom Selection Upgrade**:
  - Replaced title display with excerpt summary inside the "সংবাদ সংক্ষেপ" ticker section on the home page as requested.
  - Linked each brief item to its corresponding full news detail page `/news/[slug]`.
  - Added an admin toggle checkbox (সংবাদ সংক্ষেপ / News Briefs) to the CMS News form (`NewsForm.tsx`) with zod schemas, defaults, and API payload binding.
  - Added an elegant "Brief" badge indicator in the admin's news list (`NewsTable.tsx`) for easier management of marked articles.
  - Mapped a dedicated `briefs` dataset inside the API gateway and useHomepage hook to fetch selected items from the backend instead of static slicing, optimizing the home grid layout to start at index `2` so that no latest news articles are hidden.
- **Backend & Database**:
  - Integrated `is_brief` flag queries across database handlers, repository layers, service layers, and schema definition files, fully tested and compiling clean.
- **Infrastructure**:
  - Successfully built and deployed all changes to live production VPS containers (`backend`, `cms`, `frontend`), fully restarted and healthy.
- **Previous Infrastructure Entry**: Established secure SSH connection to Dhaka Papers live server (`180.94.20.68`) and executed complete diagnostic verification of system metrics, resources, and Docker microservices.
