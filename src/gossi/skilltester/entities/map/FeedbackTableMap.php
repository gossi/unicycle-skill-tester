<?php

namespace gossi\skilltester\entities\map;

use \RelationMap;
use \TableMap;


/**
 * This class defines the structure of the 'feedback' table.
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
class FeedbackTableMap extends TableMap
{

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = 'gossi.skilltester.entities.map.FeedbackTableMap';

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
        $this->setName('feedback');
        $this->setPhpName('Feedback');
        $this->setClassname('gossi\\skilltester\\entities\\Feedback');
        $this->setPackage('gossi.skilltester.entities');
        $this->setUseIdGenerator(true);
        // columns
        $this->addPrimaryKey('id', 'Id', 'INTEGER', true, null, null);
        $this->addForeignKey('trick_id', 'TrickId', 'INTEGER', 'trick', 'id', true, null, null);
        $this->addForeignKey('action_id', 'ActionId', 'INTEGER', 'action', 'id', true, null, null);
        $this->addColumn('percent', 'Percent', 'INTEGER', false, null, null);
        $this->addColumn('weight', 'Weight', 'INTEGER', false, null, null);
        $this->addColumn('max', 'Max', 'INTEGER', false, null, null);
        $this->addColumn('inverted', 'Inverted', 'BOOLEAN', false, 1, null);
        $this->addColumn('mistake', 'Mistake', 'VARCHAR', false, 45, null);
        // validators
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
        $this->addRelation('Trick', 'gossi\\skilltester\\entities\\Trick', RelationMap::MANY_TO_ONE, array('trick_id' => 'id', ), null, null);
        $this->addRelation('Action', 'gossi\\skilltester\\entities\\Action', RelationMap::MANY_TO_ONE, array('action_id' => 'id', ), null, null);
        $this->addRelation('Value', 'gossi\\skilltester\\entities\\Value', RelationMap::ONE_TO_MANY, array('id' => 'feedback_id', ), null, null, 'Values');
    } // buildRelations()

} // FeedbackTableMap
