import { TypeMap, Power, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois, Work, PowerResponse, WeaponResponse, ArmorResponse, VehicleResponse, ConnectionResponse, GeneralResponse, DloisResponse, EloisResponse, WorkResponse } from '@/types/types';
import { parsePower, parseWeapon, parseArmor, parseVehicle, parseConnection, parseGeneral, parseDlois, parseElois, parseWork } from './parseRecord';

export default async function getRecordById<K extends keyof TypeMap>(
    kind: K,
    id: string
): Promise<TypeMap[K] | null> {
    switch (kind) {
        case "power": return await getPowerById(id) as TypeMap[K];
        case "weapon": return await getWeaponById(id) as TypeMap[K];
        case "armor": return await getArmorById(id) as TypeMap[K];
        case "vehicle": return await getVehicleById(id) as TypeMap[K];
        case "connection": return await getConnectionById(id) as TypeMap[K];
        case "general": return await getGeneralById(id) as TypeMap[K];
        case "dlois": return await getDloisById(id) as TypeMap[K];
        case "elois": return await getEloisById(id) as TypeMap[K];
        case "work": return await getWorkById(id) as TypeMap[K];
        default: return null;
    }
}

async function getPowerById(
    id: string
): Promise<Power | null> {
    const power: Power | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'power',
            findOptions: {
                where: { id: id },
                include: {
                    ref_weapon: true,
                    ref_armor: true,
                    refed_dlois: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                }
            },
        }),
    })
    .then((response) => response.json())
    .then((records: PowerResponse[]) => records[0])
    .then((record: PowerResponse) => parsePower(record));
    return power;
}

async function getWeaponById(
    id: string
): Promise<Weapon | null> {
    const weapon: Weapon | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'weapon',
            findOptions: {
                where: { id: id },
                include: {
                    refed_power: true,
                    refed_armor: true,
                    refed_general: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: WeaponResponse[]) => records[0])
    .then((record: WeaponResponse) => parseWeapon(record));
    return weapon;
}

async function getArmorById(
    id: string
): Promise<Armor | null> {
    const armor: Armor | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'armor',
            findOptions: {
                where: { id: id },
                include: {
                    ref_weapon: true,
                    refed_power: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: ArmorResponse[]) => records[0])
    .then((record: ArmorResponse) => parseArmor(record));
    return armor;
}

async function getVehicleById(
    id: string
): Promise<Vehicle | null> {
    const vehicle: Vehicle | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'vehicle',
            findOptions: {
                where: { id: id },
                include: {
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: VehicleResponse[]) => records[0])
    .then((record: VehicleResponse) => parseVehicle(record));
    return vehicle;
}

async function getConnectionById(
    id: string
): Promise<Connection | null> {
    const connection: Connection | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'connection',
            findOptions: {
                where: { id: id },
                include: {
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: ConnectionResponse[]) => records[0])
    .then((record: ConnectionResponse) => parseConnection(record));
    return connection;
}

async function getGeneralById(
    id: string
): Promise<General | null> {
    const general: General | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'general',
            findOptions: {
                where: { id: id },
                include: {
                    ref_weapon: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: GeneralResponse[]) => records[0])
    .then((record: GeneralResponse) => parseGeneral(record));
    return general;
}

async function getDloisById(
    id: string
): Promise<Dlois | null> {
    const dlois: Dlois | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'dlois',
            findOptions: {
                where: { id: id },
                include: {
                    ref_power: true,
                    other_vers: true,
                    rel_powers: true,
                    rel_weapons: true,
                    rel_armors: true,
                    rel_vehicles: true,
                    rel_connections: true,
                    rel_generals: true,
                    rel_dloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: DloisResponse[]) => records[0])
    .then((record: DloisResponse) => parseDlois(record));
    return dlois;
}

async function getEloisById(
    id: string
): Promise<Elois | null> {
    const elois: Elois | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'elois',
            findOptions: {
                where: { id: id },
                include: {
                    rel_eloises: true,
                    rel_faqs: true,
                    rel_infos: true,
                    favorited_by: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: EloisResponse[]) => records[0])
    .then((record: EloisResponse) => parseElois(record));
    return elois;
}

async function getWorkById(
    id: string
): Promise<Work | null> {
    const work: Work | null = await fetch('/api/record', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'work',
            findOptions: {
                where: { id: id },
                select: {
                    id: true,
                    supplement: true,
                    name: true,
                    stat: true,
                    skills: true,
                    emblems: true,
                },
            },
        }),
    })
    .then((response) => response.json())
    .then((records: WorkResponse[]) => records[0])
    .then((record: WorkResponse) => parseWork(record));
    return work;
}