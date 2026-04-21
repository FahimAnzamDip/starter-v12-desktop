import { usePage } from '@inertiajs/vue3';
import { useDateTime } from './useDateTime.js';

export function useHelpers() {
    const { formatDate, formatDateTime, formatTime, formatRangePicker, formatDateOfBirthWithAge } = useDateTime();

    const formatCurrency = (value, sym = '') => {
        const position = usePage().props.settings.currency_position;
        const symbol = sym || usePage().props.settings.currency.symbol;
        const decimalSeparator = usePage().props.settings.currency.decimal_separator;
        const thousandSeparator = usePage().props.settings.currency.thousand_separator;

        if (position === 'prefix_space') {
            return `${symbol} ${numberFormat(value, 2, decimalSeparator, thousandSeparator)}`;
        }

        if (position === 'suffix_space') {
            return `${numberFormat(value, 2, decimalSeparator, thousandSeparator)} ${symbol}`;
        }

        if (position === 'suffix') {
            return `${numberFormat(value, 2, decimalSeparator, thousandSeparator)}${symbol}`;
        }

        if (position === 'prefix') {
            return `${symbol}${numberFormat(value, 2, decimalSeparator, thousandSeparator)}`;
        }

        return numberFormat(value, 2, decimalSeparator, thousandSeparator);
    };

    const currentRow = (index, pagination) => {
        return (pagination.current_page - 1) * pagination.per_page + index + 1;
    };

    function formatUnit(product) {
        if (product.unit) {
            return `${product.quantity} ${product.unit.short_name}`;
        }

        return product.quantity;
    }

    function formatStock(stockInBaseUnit, productUnits) {
        if (stockInBaseUnit == null || productUnits == null) {
            return 'N/A';
        }

        const sortedUnits = productUnits.sort((a, b) => a.operation_value - b.operation_value);
        let selectedUnit = sortedUnits.find((unit) => stockInBaseUnit / unit.operation_value <= 1);

        if (!selectedUnit || stockInBaseUnit === 0) {
            selectedUnit = sortedUnits[sortedUnits.length - 1];
        }

        let remainingQuantity = stockInBaseUnit;
        if (selectedUnit) {
            remainingQuantity -=
                Math.floor(stockInBaseUnit / selectedUnit.operation_value) * selectedUnit.operation_value;
        }

        const threshold = selectedUnit.operation_value / 100;
        const needNextSmallerUnit = remainingQuantity >= threshold;

        if (needNextSmallerUnit) {
            if (productUnits.length > 1) {
                const nextSmallerUnit = sortedUnits[sortedUnits.indexOf(selectedUnit) - 1];
                const nextSmallerQuantity = Math.floor(remainingQuantity / nextSmallerUnit.operation_value);

                remainingQuantity -= nextSmallerQuantity * nextSmallerUnit.operation_value;

                return `${Math.floor(stockInBaseUnit / selectedUnit.operation_value)} ${selectedUnit.unit_code} ${nextSmallerQuantity} ${nextSmallerUnit.unit_code}`;
            }

            return `${stockInBaseUnit / selectedUnit.operation_value} ${selectedUnit.unit_code}`;
        }

        return `${Math.floor(stockInBaseUnit / selectedUnit.operation_value)} ${selectedUnit.unit_code}`;
    }

    return {
        formatCurrency,
        formatDate,
        formatDateTime,
        formatTime,
        formatRangePicker,
        formatDateOfBirthWithAge,
        currentRow,
        formatUnit,
        formatStock,
    };
}

function numberFormat(
    number,
    decimals,
    decimalSeparator,
    thousandSeparator,
    decimalNeeded = usePage().props.settings.decimal_point == 1 ? true : false,
) {
    number = parseFloat(number);

    if (!isFinite(number) || isNaN(number)) {
        return '';
    }

    if (!decimalNeeded) {
        number = Math.round(number);
        decimals = 0;
    }

    const fixedNumber = number.toFixed(decimals);
    const parts = fixedNumber.split('.');

    if (parts.length > 1 && parts[1] === '00') {
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }

    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? decimalSeparator + parts[1] : '';

    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) + decimalPart;
}
