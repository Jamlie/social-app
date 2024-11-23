import { Firestore, getFirestore } from "firebase-admin/firestore";
import { app } from "./firebaseServer";
import { Auth, getAuth } from "firebase-admin/auth";

export class Database {
    private static _instance: Database;
    private _db: Firestore | null = null;
    private _auth: Auth | null = null;

    private constructor() {}

    public static new(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
        }

        return Database._instance;
    }

    public get db() {
        if (!this._db) {
            this._db = getFirestore(app);
        }
        return this._db;
    }

    public get auth() {
        if (!this._auth) {
            this._auth = getAuth(app);
        }
        return this._auth;
    }
}

export const database = Database.new();
