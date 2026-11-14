import * as z from "zod";
export const Augment = z.object({
    name: z.string(),
    index: z.number(),
    level: z.number(),
    maxlv: z.number(),
    lvcap: z.number(),
    desc: z.string()
});
export type Augment = z.infer<typeof Augment>;

export const PassiveAbility = z.object({
    name: z.string(),
    desc: z.string(),
    activated: z.boolean(),
});
export type PassiveAbility = z.infer<typeof PassiveAbility>;

export const WeaponEntry = z.object({
    gID: z.number(),
    wID: z.number(),
    augs: z.array(Augment),
    passives: z.array(PassiveAbility),
});
export type WeaponEntry = z.infer<typeof WeaponEntry>;

export const TempSave = z.object({
    version: z.string(),
    curGunID: z.number(),
    boxCount: z.number(),
    lootBoxes: z.array(z.number()),
    widgets: z.number(),
    money: z.number(),
    gunListKeys: z.array(z.number()),
    gunListValues: z.array(WeaponEntry),
    soldGunKeys: z.array(z.number()),
    soldGunValues: z.array(WeaponEntry),
});

export type TempSave = z.infer<typeof TempSave>;