package com.nativernkeeptokenapp.repository;

import io.realm.DynamicRealm;
import io.realm.FieldAttribute;
import io.realm.RealmMigration;
import io.realm.RealmObjectSchema;
import io.realm.RealmSchema;


/**
 * Important! If you make a change to any of the realm objects (eg RealmToken) you need to perform a DataBase migration
 * NB: Ensure the primitive types match up. EG if you used long timeObject; in the DataBase class then use long.class here, don't use Long.class!
 */
public class AWRealmMigration implements RealmMigration
{
    @Override
    public void migrate(DynamicRealm realm, long oldVersion, long newVersion)
    {
    }

    @Override
    public int hashCode()
    {
        return AWRealmMigration.class.hashCode();
    }

    @Override
    public boolean equals(Object object)
    {
        return object instanceof AWRealmMigration;
    }
}