<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class DatabaseOverrideServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * This method runs after all service providers have been registered,
     * including NativePHP's NativeServiceProvider. We use this to override
     * the database connection back to MySQL for our main application data
     * and queue operations, while allowing NativePHP to keep its internal
     * SQLite connection for its own operations.
     */
    public function boot(): void
    {
        // Only override if running in NativePHP environment
        if (config('nativephp-internal.running')) {
            // Override default database connection to MySQL
            config(['database.default' => 'mysql']);

            // Override queue-related database connections to MySQL
            config(['queue.failed.database' => 'mysql']);
            config(['queue.batching.database' => 'mysql']);
            config(['queue.connections.database.connection' => 'mysql']);

            // Note: The 'nativephp' SQLite connection remains available
            // for NativePHP's internal operations if needed
        }
    }
}
