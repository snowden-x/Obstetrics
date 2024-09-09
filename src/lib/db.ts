import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface PatientRecord {
    id: string;
    name: string;
    age: number;
    g: number;
    p: number;
    ega: string;
    edd: string;
    beingManagedFor: string;
    complaints: string;
    updates: string;
    odq: {
        fetalMovements: boolean;
        lossOfLiquor: boolean;
        lowerAbdominalPain: boolean;
        bleedingPerVaginum: boolean;
        fever: boolean;
        nausea: boolean;
        vomiting: boolean;
        dysuria: boolean;
        frequency: boolean;
        chills: boolean;
        headache: boolean;
        blurredVision: boolean;
        dizziness: boolean;
        easyFatiguability: boolean;
        chestPain: boolean;
        palpitations: boolean;
        bipedalSwelling: boolean;
    };
    systemicEnquiry: string;
    examination: {
        general: string;
        vitalSigns: {
            bp: string;
        };
        cvs: string;
        rs: string;
        abd: string;
        uterus: string;
        cns: string;
    };
    investigations: string;
    impression: string;
    plan: string;
    createdAt: number;
    updatedAt: number;
}

interface MyDB extends DBSchema {
    patients: {
        key: string;
        value: PatientRecord;
        indexes: { 'by-date': number };
    };
}

let dbPromise: Promise<IDBPDatabase<MyDB>> | null = null;

function getDB(): Promise<IDBPDatabase<MyDB>> {
    if (!dbPromise) {
        dbPromise = openDB<MyDB>('obstetrics-db', 1, {
            upgrade(db) {
                const patientStore = db.createObjectStore('patients', {
                    keyPath: 'id'
                });
                patientStore.createIndex('by-date', 'createdAt');
            },
        });
    }
    return dbPromise;
}

export async function getPatients(): Promise<PatientRecord[]> {
    if (typeof window === 'undefined') return [];
    const db = await getDB();
    return db.getAll('patients');
}

export async function addPatient(patient: PatientRecord): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const db = await getDB();
    return db.add('patients', patient);
}

export async function updatePatient(patient: PatientRecord): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const db = await getDB();
    return db.put('patients', patient);
}

export async function deletePatient(id: string): Promise<void | null> {
    if (typeof window === 'undefined') return null;
    const db = await getDB();
    return db.delete('patients', id);
}

export async function getPatientById(id: string): Promise<PatientRecord | undefined | null> {
    if (typeof window === 'undefined') return null;
    const db = await getDB();
    return db.get('patients', id);
}