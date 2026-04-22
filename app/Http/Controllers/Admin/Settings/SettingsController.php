<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingsResource;
use App\Http\Services\UploadService;
use App\Models\Currency;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function edit()
    {
        abort_if(Gate::denies('access_settings'), 403);

        $setting = new SettingsResource(Setting::firstOrFail());
        $currencies = Currency::all();
        $timezones = \DateTimeZone::listIdentifiers(\DateTimeZone::ALL);

        return Inertia::render('Admin/Settings/Edit', [
            'setting' => $setting,
            'currencies' => $currencies,
            'timezones' => $timezones,
        ]);
    }

    public function update(Request $request, Setting $setting, UploadService $upload)
    {
        abort_if(Gate::denies('access_settings'), 403);

        $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['required', 'string', 'max:255'],
            'company_mobile' => ['required', 'string', 'max:255'],
            'currency_id' => ['required', 'numeric'],
            'vat_id' => ['nullable', 'string', 'max:255'],
            'tax_percentage' => ['required', 'integer'],
            'currency_position' => ['required', 'string', 'max:255'],
            'company_address' => ['required', 'string', 'max:255'],
            'decimal_point' => ['required', 'numeric', 'in:0,1'],
            'time_zone' => ['required', 'string', 'max:255'],
            'time_format' => ['required', 'string', 'max:255'],
            'date_format' => ['required', 'string', 'max:255'],
        ]);

        $setting->update($request->except('logo', 'favicon'));

        if ($request->input('logo')) {
            $upload->uploadImage($setting, $request->input('logo'), 'logo');
        }

        if ($request->input('favicon')) {
            $upload->uploadImage($setting, $request->input('favicon'), 'favicon');
        }

        cache()->clear();

        return Redirect::route('settings.edit');
    }
}
