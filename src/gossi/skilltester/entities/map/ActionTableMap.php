<?php

namespace gossi\skilltester\entities\map;

use \RelationMap;
use \TableMap;


/**
 * This class defines the structure of the 'action' table.
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
class ActionTableMap extends TableMap
{

    /**
     * The (dot-path) name of this class
     */
    const CLASS_NAME = 'gossi.skilltester.entities.map.ActionTableMap';

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
        $this->setName('action');
        $this->setPhpName('Action');
        $this->setClassname('gossi\\skilltester\\entities\\Action');
        $this->setPackage('gossi.skilltester.entities');
        $this->setUseIdGenerator(true);
        // columns
        $this->addPrimaryKey('id', 'Id', 'INTEGER', true, null, null);
        $this->addColumn('type', 'Type', 'VARCHAR', false, 45, 'boolean');
        // validators
    } // initialize()

    /**
     * Build the RelationMap objects for this table relationships
     */
    public function buildRelations()
    {
        $this->addRelation('ActionMap', 'gossi\\skilltester\\entities\\ActionMap', RelationMap::ONE_TO_ONE, array('id' => 'child_id', ), null, null);
        $this->addRelation('Item', 'gossi\\skilltester\\entities\\Item', RelationMap::ONE_TO_MANY, array('id' => 'action_id', ), null, null, 'Items');
        $this->addRelation('Feedback', 'gossi\\skilltester\\entities\\Feedback', RelationMap::ONE_TO_MANY, array('id' => 'action_id', ), null, null, 'Feedbacks');
        $this->addRelation('ActionI18n', 'gossi\\skilltester\\entities\\ActionI18n', RelationMap::ONE_TO_MANY, array('id' => 'id', ), 'CASCADE', null, 'ActionI18ns');
    } // buildRelations()

    /**
     *
     * Gets the list of behaviors registered for this table
     *
     * @return array Associative array (name => parameters) of behaviors
     */
    public function getBehaviors()
    {
        return array(
            'i18n' =>  array (
  'i18n_table' => '%TABLE%_i18n',
  'i18n_phpname' => '%PHPNAME%I18n',
  'i18n_columns' => 'title, description',
  'i18n_pk_name' => NULL,
  'locale_column' => 'locale',
  'default_locale' => 'de',
  'locale_alias' => '',
),
        );
    } // getBehaviors()

} // ActionTableMap
