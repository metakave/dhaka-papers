import { BriefForm } from '@/components/custom/BriefForm';

export default function CreateBriefPage() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">নতুন সংবাদ সংক্ষেপ তৈরি করুন</h1>
            <BriefForm mode="create" />
        </div>
    );
}
