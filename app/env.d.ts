declare namespace NodeJS {
    export interface ProcessEnv {
        readonly FIREBASE_PRIVATE_KEY_ID: string;
        readonly FIREBASE_PRIVATE_KEY: string;
        readonly FIREBASE_PROJECT_ID: string;
        readonly FIREBASE_CLIENT_EMAIL: string;
        readonly FIREBASE_CLIENT_ID: string;
        readonly FIREBASE_AUTH_URI: string;
        readonly FIREBASE_TOKEN_URI: string;
        readonly FIREBASE_AUTH_CERT_URL: string;
        readonly FIREBASE_CLIENT_CERT_URL: string;

        readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
        readonly NEXT_PUBLIC_FIREBASE_API_PUBLIC_KEY: string;
        readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
        readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
        readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
        readonly NEXT_PUBLIC_FIREBASE_APP_ID: string;
        readonly NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
    }
}
