<?php

use App\Http\Resources\SettingsResource;
use App\Models\Setting;
use Carbon\Carbon;

if (! function_exists('settings')) {
    function settings(): object
    {
        return cache()->remember('settings', 24 * 60, function () {
            return (object) (new SettingsResource(Setting::firstOrFail()))->resolve();
        });
    }
}

if (! function_exists('make_reference_id')) {
    function make_reference_id($prefix, $number): string
    {
        return $prefix.'-'.date('y').'-'.str_pad($number, 5, 0, STR_PAD_LEFT);
    }
}

if (! function_exists('get_start_end_date')) {
    function get_start_end_date($date_range): array
    {
        $start_date = null;
        $end_date = null;

        if (is_array($date_range) && isset($date_range[0]) && ! empty($date_range[0])) {
            $start_date = Carbon::parse($date_range[0])->format('Y-m-d');

            if (isset($date_range[1]) && $date_range[1] !== 'Invalid date' && ! empty($date_range[1])) {
                $end_date = Carbon::parse($date_range[1])->format('Y-m-d');
            } else {
                $end_date = Carbon::parse(today())->format('Y-m-d');
            }
        }

        return [$start_date, $end_date];
    }
}

if (! function_exists('format_currency')) {
    function format_currency($value, $format = true)
    {
        if (! $format) {
            return $value;
        }

        $settings = settings();
        $position = $settings->currency_position;
        $symbol = $settings->currency->symbol;
        $decimal_separator = $settings->currency->decimal_separator;
        $thousand_separator = $settings->currency->thousand_separator;
        $decimal_places = $settings->decimal_point == 1 ? 2 : 0; // Use decimal_point setting

        if ($position == 'prefix') {
            $formatted_value = $symbol.number_format((float) $value, $decimal_places, $decimal_separator, $thousand_separator);
        } elseif ($position == 'suffix') {
            $formatted_value = number_format((float) $value, $decimal_places, $decimal_separator, $thousand_separator).$symbol;
        } elseif ($position == 'suffix_space') {
            $formatted_value = number_format((float) $value, $decimal_places, $decimal_separator, $thousand_separator).' '.$symbol;
        } elseif ($position == 'prefix_space') {
            $formatted_value = $symbol.' '.number_format((float) $value, $decimal_places, $decimal_separator, $thousand_separator);
        } else {
            $formatted_value = $value;
        }

        return $formatted_value;
    }
}

if (! function_exists('format_dob_with_age')) {
    function format_dob_with_age($dateOfBirth, string $fallback = '—'): string
    {
        if (! $dateOfBirth) {
            return $fallback;
        }

        try {
            $dob = Carbon::parse($dateOfBirth);
        } catch (Throwable $exception) {
            return $fallback;
        }

        $formattedDate = $dob->format('d/m/Y');
        $today = Carbon::today();

        if ($dob->greaterThan($today)) {
            return $formattedDate;
        }

        $ageInYears = round($dob->diffInMonths($today) / 12, 1);

        return $formattedDate.' ('.number_format($ageInYears, 1, '.', '').' years)';
    }
}
