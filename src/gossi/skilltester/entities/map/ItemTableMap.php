<?php

namespace gossi\skilltester\entities\map;

use \RelationMap;
use \TableMap;


/**
 * This class defines the structure of the 'item' table.
 *
 *
 *
 * This map class is used by Propel to do runtime db structure discovery.
 * For example, the createSelectSql() method checks the type of a given column used in an
 * ORDER BY clause to know whether it needs to apply SQL to make the ORDER BY case-insensitive
 * (i.e. if it's a text column type).
 *
 * @package    propel.generator.gossi.skilltester.entities.map
 */
class ItemTableMap extends TableMap
{

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = 'gossi.skilltester.entities.map.ItemTableMap';

    /**
     * Initialize the table attributes, columns and validators
     * Relations are not initialized by this method since they are lazy loaded
     *
     * @return void
     * @throws PropelException
     */
    public function initialize()
    {
        // attributes
        $this->setName('item');
        $this->setPhpName('Item');
        $this->setClassname('gossi\\skilltester\\entities\\Item');
        $this->setPackage('gossi.skilltester.entities');
        $this->setUseIdGenerator(false);
        // columns
        $this->addForeignPrimaryKey('trick_id', 'TrickId', 'INTEGER' , 'trick', 'id', true, null, null);
        $this->addForeignPrimaryKey('group_id', 'GroupId', 'INTEGER' , 'group', 'id', true, null, null);
        $this->addForeignPrimaryKey('action_id', 'ActionId', 'INTEGER' , 'action', 'id', true, null, null);
        // validators
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
        $this->addRelation('Trick', 'gossi\\skilltester\\entities\\Trick', RelationMap::MANY_TO_ONE, array('trick_id' => 'id', ), null, null);
        $this->addRelation('Group', 'gossi\\skilltester\\entities\\Group', RelationMap::MANY_TO_ONE, array('group_id' => 'id', ), null, null);
        $this->addRelation('Action', 'gossi\\skilltester\\entities\\Action', RelationMap::MANY_TO_ONE, array('action_id' => 'id', ), null, null);
    } // buildRelations()

} // ItemTableMap
