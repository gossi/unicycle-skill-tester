<?php

namespace gossi\skilltester\entities\map;

use \RelationMap;
use \TableMap;


/**
 * This class defines the structure of the 'action_map' table.
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
class ActionMapTableMap extends TableMap
{

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = 'gossi.skilltester.entities.map.ActionMapTableMap';

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
        $this->setName('action_map');
        $this->setPhpName('ActionMap');
        $this->setClassname('gossi\\skilltester\\entities\\ActionMap');
        $this->setPackage('gossi.skilltester.entities');
        $this->setUseIdGenerator(false);
        $this->setIsCrossRef(true);
        // columns
        $this->addForeignPrimaryKey('parent_id', 'ParentId', 'INTEGER' , 'action', 'id', true, null, null);
        $this->addForeignPrimaryKey('child_id', 'ChildId', 'INTEGER' , 'action', 'id', true, null, null);
        // validators
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
        $this->addRelation('Action', 'gossi\\skilltester\\entities\\Action', RelationMap::MANY_TO_ONE, array('parent_id' => 'id', 'child_id' => 'id', ), null, null);
    } // buildRelations()

} // ActionMapTableMap
