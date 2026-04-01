export const formatBengaliDate = (dateString: string | Date, locale: string = 'bn'): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    if (locale === 'en') {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    const months = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const monthName = months[date.getMonth()];
    const day = date.getDate().toLocaleString('bn-BD');
    const year = date.getFullYear().toLocaleString('bn-BD').replace(/,/g, '');

    return `${day} ${monthName}, ${year}`;
};

export const getBengaliDayMonthYear = (dateString: string | Date, locale: string = 'bn'): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    if (locale === 'en') {
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    const months = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const monthName = months[date.getMonth()];
    const day = date.getDate().toLocaleString('bn-BD');
    const year = date.getFullYear().toLocaleString('bn-BD').replace(/,/g, '');

    return `${day} ${monthName}, ${year}`;
}

export const formatBengaliDateTime = (dateString: string | Date, locale: string = 'bn'): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    if (locale === 'en') {
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    const months = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const monthName = months[date.getMonth()];
    const day = date.getDate().toLocaleString('bn-BD');
    const year = date.getFullYear().toLocaleString('bn-BD').replace(/,/g, '');

    // Time formatting
    const hours = date.getHours().toLocaleString('bn-BD');
    const minutes = date.getMinutes().toLocaleString('bn-BD').padStart(2, '০');

    return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
}

export const toBengaliNumber = (num: number | string, locale: string = 'bn'): string => {
    if (locale === 'en') return num.toString();
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => bengaliDigits[parseInt(digit)] || digit).join('');
};

export const getRelativeTimeBengali = (dateString: string | Date, locale: string = 'bn'): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (locale === 'en') {
        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return getBengaliDayMonthYear(dateString, 'en');
    }

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
