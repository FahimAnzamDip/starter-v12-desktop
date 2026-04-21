import { usePage } from '@inertiajs/vue3';
import { format } from 'date-fns';

export function useDateTime() {
    const convertFormat = (momentFormat) => {
        return momentFormat
            .replace(/Y{4}/g, 'yyyy')
            .replace(/Y{2}/g, 'yy')
            .replace(/M{4}/g, 'MMMM')
            .replace(/M{3}/g, 'MMM')
            .replace(/M{2}/g, 'MM')
            .replace(/M/g, 'M')
            .replace(/D{2}/g, 'dd')
            .replace(/D/g, 'd')
            .replace(/d{4}/g, 'EEEE')
            .replace(/d{3}/g, 'EEE')
            .replace(/A/g, 'a')
            .replace(/H{2}/g, 'HH')
            .replace(/h{2}/g, 'hh')
            .replace(/m{2}/g, 'mm')
            .replace(/s{2}/g, 'ss');
    };

    const formatDate = (value, momentFormat = usePage().props.settings.date_format) => {
        if (!value) {
            return '';
        }

        const dateFormat = convertFormat(momentFormat);
        return format(new Date(value), dateFormat);
    };

    const formatDateTime = (value, momentFormat = usePage().props.settings.date_format, whichOne = 'all') => {
        if (!value) {
            return '';
        }

        const settings = usePage().props.settings;
        const is24Hour = settings.time_format === '24' || settings.time_24_hour === true;
        const timeFormat = is24Hour ? 'HH:mm' : 'hh:mm a';
        const dateFormat = convertFormat(momentFormat);

        if (whichOne === 'all') {
            return format(new Date(value), `${dateFormat} ${timeFormat}`);
        }

        if (whichOne === 'date') {
            return format(new Date(value), dateFormat);
        }

        if (whichOne === 'time') {
            return format(new Date(value), timeFormat);
        }

        return '';
    };

    const formatTime = (value) => {
        if (!value) {
            return '';
        }

        const settings = usePage().props.settings;
        const is24Hour = settings.time_format === '24' || settings.time_24_hour === true;
        const timeFormat = is24Hour ? 'HH:mm' : 'hh:mm a';

        const today = new Date();
        const [hours, minutes] = value.split(':');
        today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

        return format(today, timeFormat);
    };

    const formatRangePicker = (date) => {
        const [startDate, endDate] = date;
        const dateFormat = convertFormat(usePage().props.settings.date_format);

        if (!endDate) {
            const formattedStartDate = format(new Date(startDate), dateFormat);
            const formattedEndDate = format(new Date(), dateFormat);
            return `${formattedStartDate} to ${formattedEndDate}`;
        }

        const formattedStartDate = format(new Date(startDate), dateFormat);
        const formattedEndDate = format(new Date(endDate), dateFormat);
        return `${formattedStartDate} to ${formattedEndDate}`;
    };

    const formatDateOfBirthWithAge = (value, fallback = '—', momentFormat = usePage().props.settings.date_format) => {
        if (!value) return fallback;

        const dob = new Date(value);
        if (Number.isNaN(dob.getTime())) return fallback;

        const formattedDate = formatDate(value, momentFormat);
        const today = new Date();

        let monthsDiff = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());

        if (today.getDate() < dob.getDate()) {
            monthsDiff--;
        }

        if (monthsDiff < 0) {
            return formattedDate;
        }

        const ageInYears = (monthsDiff / 12).toFixed(1);

        return `${formattedDate} (${ageInYears} years)`;
    };

    return { formatDate, formatDateTime, formatTime, formatRangePicker, formatDateOfBirthWithAge };
}
