import { Actor, Armor, Game, Ammo, Form, Light, Weapon, printConsole, cloneWeapoForLeftHand } from 'skyrimPlatform';
import * as sp from 'skyrimPlatform';

export interface Equipment {
    armor: number[],
    numChanges: number,
    leftHandWeapon:number,
    rightHandWeapon:number  
};

enum FormType {
    kLight = 31
};

let isArmorLike = (form: Form) => Armor.from(form) || Ammo.from(form) || Light.from(form);
let isWeaponLike = (form: Form) => Weapon.from(form);

export let isBadMenuShown = () => {
    let menus = [
        'InventoryMenu', 
        'FavoritesMenu',
        'MagicMenu'
    ];
    let isMenuOpen = sp['UI']['isMenuOpen'];
    return menus.map(name => isMenuOpen(name)).indexOf(true) !== -1;
}

let isAnyTorchEquipped = (actor: Actor) => {
    const torch = 11;
    const leftHand = 0;
    return actor.getEquippedItemType(leftHand) === torch;
}

let isEquipped = (actor: Actor, f: Form) => {
    //printConsole('isEquipped', f.getType());
    if (f.getType() === FormType.kLight) {
        return isAnyTorchEquipped(actor);
    }
    return actor.isEquipped(f);
}

let unequipItem = (actor: Actor, f: Form) => {
    //printConsole('unequipItem', f.getType());
    if (f.getType() === FormType.kLight) {
        if (isBadMenuShown()) return;
    }
    actor.unequipItem(f, true, true);
}

let isBothHandsWeapon = (weapon: Weapon) => {
    if (!weapon) return false;
    switch(weapon.getWeaponType()) {
        case 5:
        case 6:
        case 7:
        case 9:
            return true;
    }
    return false;
};

let equipItem = (actor: Actor, f: Form) => {
    let armor = Armor.from(f);
    const shieldMask = 0x00000200;
    let isShield = armor && armor.getSlotMask() & shieldMask;
    let weapon = Weapon.from(f);
    if (isShield || Light.from(f) || isBothHandsWeapon(weapon)) {
        if (isAnyTorchEquipped(actor) && isBadMenuShown()) {
            return printConsole(`sorry it may lead to crash`);
        }
    }
    let isStaff = weapon && weapon.getWeaponType() === 8;
    if (isStaff) return printConsole(`staffs are disabled for now`);
    actor.equipItem(f, true, true);
}

export let getEquippedWeaponId = (actor:Actor, isLeft:boolean) =>{
    let weapon = actor.getEquippedWeapon(isLeft);
    return weapon ? weapon.getFormID() : 0;
};

export let getEquipment = (actor: Actor, numChanges: number): Equipment => {
    let armor = new Array<number>();
    let n = actor.getNumItems();

    for (let i = 0; i < n; ++i) {
        let f = actor.getNthForm(i);
        if (isArmorLike(f) && isEquipped(actor, f)) {
            armor.push(f.getFormID());
        }
    }

    let rightHandWeapon = getEquippedWeaponId(Game.getPlayer(), false);
    let leftHandWeapon = getEquippedWeaponId(Game.getPlayer(), true);
    return { armor, numChanges, leftHandWeapon, rightHandWeapon };
};

export let applyEquipment = (actor: Actor, equipment: Equipment) => {
    getEquipment(actor, -1).armor.forEach(armor => {
        if (equipment.armor.indexOf(armor) === -1) {
            let f = Game.getFormEx(armor);
            if (f && isArmorLike(f)) unequipItem(actor, f);
        }
    });

    equipment.armor
        .map(id => Game.getFormEx(id))
        .filter(form => !!form)
        .forEach(form => equipItem(actor, form));

    if (equipment.rightHandWeapon === 0){
        let rWeap = getEquippedWeaponId(actor, false);
        if(rWeap !== 0) {
            actor.unequipItem(Game.getFormEx(rWeap), true,true);
        }
    }
       
    if (typeof equipment.rightHandWeapon === 'number') {
        let right = Game.getFormEx(equipment.rightHandWeapon);
        if (right && !isBadMenuShown() && equipment.rightHandWeapon !== getEquippedWeaponId(actor, false)) {
            equipItem(actor,right);
        }
    }

    /*if (false) {
            let idForLeft = cloneWeapoForLeftHand(equipment.leftHandWeapon);
            printConsole(`idForLeft  = ${idForLeft}`);
           actor.equipItem(Game.getFormEx(idForLeft), true, true);
    }*/
};