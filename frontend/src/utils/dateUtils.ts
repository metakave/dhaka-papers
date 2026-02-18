export const formatBengaliDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const days = ['রোববার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const months = [
        'জানুয়ারি',
        'ফেব্রুয়ারি', // Explicitly using the user's preferred spelling
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর',
        'ডিসেম্বর'
    ];

    const monthName = months[date.getMonth()];
    const day = date.getDate().toLocaleString('bn-BD');
    const year = date.getFullYear().toLocaleString('bn-BD').replace(/,/g, '');

    return `${day} ${monthName}, ${year}`;
};

export const getBengaliDayMonthYear = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // For cases where we just want "15 February, 2026" without the day name
    const months = [
        'জানুয়ারি',
        'ফেব্রুয়ারি',
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর',
        'ডিসেম্বর'
    ];

    const monthName = months[date.getMonth()];
    const day = date.getDate().toLocaleString('bn-BD');
    const year = date.getFullYear().toLocaleString('bn-BD').replace(/,/g, '');

    return `${day} ${monthName}, ${year}`;
}

export const formatBengaliDateTime = (dateString: string | Date): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const months = [
        'জানুয়ারি',
        'ফেব্রুয়ারি',
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর',
        'ডিসেম্বর'
    ];

    const monthName = months[date.getMonth()];
    const day = date.getDate().toLocaleString('bn-BD');
    const year = date.getFullYear().toLocaleString('bn-BD').replace(/,/g, '');

    // Time formatting
    const hours = date.getHours().toLocaleString('bn-BD');
    const minutes = date.getMinutes().toLocaleString('bn-BD').padStart(2, '০');

    return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
}

const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

export const getRelativeTimeBengali = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'এইমাত্র';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${toBengaliNumber(diffInMinutes)} মিনিট আগে`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${toBengaliNumber(diffInHours)} ঘণ্টা আগে`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${toBengaliNumber(diffInDays)} দিন আগে`;
    }

    return getBengaliDayMonthYear(dateString);
};
