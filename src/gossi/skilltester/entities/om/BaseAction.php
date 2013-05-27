<?php

namespace gossi\skilltester\entities\om;

use \BaseObject;
use \BasePeer;
use \Criteria;
use \Exception;
use \PDO;
use \Persistent;
use \Propel;
use \PropelCollection;
use \PropelException;
use \PropelObjectCollection;
use \PropelPDO;
use gossi\skilltester\entities\Action;
use gossi\skilltester\entities\ActionI18n;
use gossi\skilltester\entities\ActionI18nQuery;
use gossi\skilltester\entities\ActionMap;
use gossi\skilltester\entities\ActionMapQuery;
use gossi\skilltester\entities\ActionPeer;
use gossi\skilltester\entities\ActionQuery;
use gossi\skilltester\entities\Feedback;
use gossi\skilltester\entities\FeedbackQuery;
use gossi\skilltester\entities\Item;
use gossi\skilltester\entities\ItemQuery;

/**
 * Base class that represents a row from the 'action' table.
 *
 *
 *
 * @package    propel.generator.gossi.skilltester.entities.om
 */
abstract class BaseAction extends BaseObject implements Persistent
{
    /**
     * Peer class name
     */
    const PEER = 'gossi\\skilltester\\entities\\ActionPeer';

    /**
     * The Peer class.
     * Instance provides a convenient way of calling static methods on a class
     * that calling code may not be able to identify.
     * @var        ActionPeer
     */
    protected static $peer;

    /**
     * The flag var to prevent infinit loop in deep copy
     * @var       boolean
     */
    protected $startCopy = false;

    /**
     * The value for the id field.
     * @var        int
     */
    protected $id;

    /**
     * The value for the type field.
     * Note: this column has a database default value of: 'boolean'
     * @var        string
     */
    protected $type;

    /**
     * @var        ActionMap one-to-one related ActionMap object
     */
    protected $singleActionMap;

    /**
     * @var        PropelObjectCollection|Item[] Collection to store aggregation of Item objects.
     */
    protected $collItems;
    protected $collItemsPartial;

    /**
     * @var        PropelObjectCollection|Feedback[] Collection to store aggregation of Feedback objects.
     */
    protected $collFeedbacks;
    protected $collFeedbacksPartial;

    /**
     * @var        PropelObjectCollection|ActionI18n[] Collection to store aggregation of ActionI18n objects.
     */
    protected $collActionI18ns;
    protected $collActionI18nsPartial;

    /**
     * Flag to prevent endless save loop, if this object is referenced
     * by another object which falls in this transaction.
     * @var        boolean
     */
    protected $alreadyInSave = false;

    /**
     * Flag to prevent endless validation loop, if this object is referenced
     * by another object which falls in this transaction.
     * @var        boolean
     */
    protected $alreadyInValidation = false;

    /**
     * Flag to prevent endless clearAllReferences($deep=true) loop, if this object is referenced
     * @var        boolean
     */
    protected $alreadyInClearAllReferencesDeep = false;

    // i18n behavior

    /**
     * Current locale
     * @var        string
     */
    protected $currentLocale = 'de';

    /**
     * Current translation objects
     * @var        array[ActionI18n]
     */
    protected $currentTranslations;

    /**
     * An array of objects scheduled for deletion.
     * @var		PropelObjectCollection
     */
    protected $actionMapsScheduledForDeletion = null;

    /**
     * An array of objects scheduled for deletion.
     * @var		PropelObjectCollection
     */
    protected $itemsScheduledForDeletion = null;

    /**
     * An array of objects scheduled for deletion.
     * @var		PropelObjectCollection
     */
    protected $feedbacksScheduledForDeletion = null;

    /**
     * An array of objects scheduled for deletion.
     * @var		PropelObjectCollection
     */
    protected $actionI18nsScheduledForDeletion = null;

    /**
     * Applies default values to this object.
     * This method should be called from the object's constructor (or
     * equivalent initialization method).
     * @see        __construct()
     */
    public function applyDefaultValues()
    {
        $this->type = 'boolean';
    }

    /**
     * Initializes internal state of BaseAction object.
     * @see        applyDefaults()
     */
    public function __construct()
    {
        parent::__construct();
        $this->applyDefaultValues();
    }

    /**
     * Get the [id] column value.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get the [type] column value.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set the value of [id] column.
     *
     * @param int $v new value
     * @return Action The current object (for fluent API support)
     */
    public function setId($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->id !== $v) {
            $this->id = $v;
            $this->modifiedColumns[] = ActionPeer::ID;
        }


        return $this;
    } // setId()

    /**
     * Set the value of [type] column.
     *
     * @param string $v new value
     * @return Action The current object (for fluent API support)
     */
    public function setType($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (string) $v;
        }

        if ($this->type !== $v) {
            $this->type = $v;
            $this->modifiedColumns[] = ActionPeer::TYPE;
        }


        return $this;
    } // setType()

    /**
     * Indicates whether the columns in this object are only set to default values.
     *
     * This method can be used in conjunction with isModified() to indicate whether an object is both
     * modified _and_ has some values set which are non-default.
     *
     * @return boolean Whether the columns in this object are only been set with default values.
     */
    public function hasOnlyDefaultValues()
    {
            if ($this->type !== 'boolean') {
                return false;
            }

        // otherwise, everything was equal, so return true
        return true;
    } // hasOnlyDefaultValues()

    /**
     * Hydrates (populates) the object variables with values from the database resultset.
     *
     * An offset (0-based "start column") is specified so that objects can be hydrated
     * with a subset of the columns in the resultset rows.  This is needed, for example,
     * for results of JOIN queries where the resultset row includes columns from two or
     * more tables.
     *
     * @param array $row The row returned by PDOStatement->fetch(PDO::FETCH_NUM)
     * @param int $startcol 0-based offset column which indicates which restultset column to start with.
     * @param boolean $rehydrate Whether this object is being re-hydrated from the database.
     * @return int             next starting column
     * @throws PropelException - Any caught Exception will be rewrapped as a PropelException.
     */
    public function hydrate($row, $startcol = 0, $rehydrate = false)
    {
        try {

            $this->id = ($row[$startcol + 0] !== null) ? (int) $row[$startcol + 0] : null;
            $this->type = ($row[$startcol + 1] !== null) ? (string) $row[$startcol + 1] : null;
            $this->resetModified();

            $this->setNew(false);

            if ($rehydrate) {
                $this->ensureConsistency();
            }
            $this->postHydrate($row, $startcol, $rehydrate);
            return $startcol + 2; // 2 = ActionPeer::NUM_HYDRATE_COLUMNS.

        } catch (Exception $e) {
            throw new PropelException("Error populating Action object", $e);
        }
    }

    /**
     * Checks and repairs the internal consistency of the object.
     *
     * This method is executed after an already-instantiated object is re-hydrated
     * from the database.  It exists to check any foreign keys to make sure that
     * the objects related to the current object are correct based on foreign key.
     *
     * You can override this method in the stub class, but you should always invoke
     * the base method from the overridden method (i.e. parent::ensureConsistency()),
     * in case your model changes.
     *
     * @throws PropelException
     */
    public function ensureConsistency()
    {

    } // ensureConsistency

    /**
     * Reloads this object from datastore based on primary key and (optionally) resets all associated objects.
     *
     * This will only work if the object has been saved and has a valid primary key set.
     *
     * @param boolean $deep (optional) Whether to also de-associated any related objects.
     * @param PropelPDO $con (optional) The PropelPDO connection to use.
     * @return void
     * @throws PropelException - if this object is deleted, unsaved or doesn't have pk match in db
     */
    public function reload($deep = false, PropelPDO $con = null)
    {
        if ($this->isDeleted()) {
            throw new PropelException("Cannot reload a deleted object.");
        }

        if ($this->isNew()) {
            throw new PropelException("Cannot reload an unsaved object.");
        }

        if ($con === null) {
            $con = Propel::getConnection(ActionPeer::DATABASE_NAME, Propel::CONNECTION_READ);
        }

        // We don't need to alter the object instance pool; we're just modifying this instance
        // already in the pool.

        $stmt = ActionPeer::doSelectStmt($this->buildPkeyCriteria(), $con);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        $stmt->closeCursor();
        if (!$row) {
            throw new PropelException('Cannot find matching row in the database to reload object values.');
        }
        $this->hydrate($row, 0, true); // rehydrate

        if ($deep) {  // also de-associate any related objects?

            $this->singleActionMap = null;

            $this->collItems = null;

            $this->collFeedbacks = null;

            $this->collActionI18ns = null;

        } // if (deep)
    }

    /**
     * Removes this object from datastore and sets delete attribute.
     *
     * @param PropelPDO $con
     * @return void
     * @throws PropelException
     * @throws Exception
     * @see        BaseObject::setDeleted()
     * @see        BaseObject::isDeleted()
     */
    public function delete(PropelPDO $con = null)
    {
        if ($this->isDeleted()) {
            throw new PropelException("This object has already been deleted.");
        }

        if ($con === null) {
            $con = Propel::getConnection(ActionPeer::DATABASE_NAME, Propel::CONNECTION_WRITE);
        }

        $con->beginTransaction();
        try {
            $deleteQuery = ActionQuery::create()
                ->filterByPrimaryKey($this->getPrimaryKey());
            $ret = $this->preDelete($con);
            if ($ret) {
                $deleteQuery->delete($con);
                $this->postDelete($con);
                // i18n behavior

                // emulate delete cascade
                ActionI18nQuery::create()
                    ->filterByAction($this)
                    ->delete($con);

                $con->commit();
                $this->setDeleted(true);
            } else {
                $con->commit();
            }
        } catch (Exception $e) {
            $con->rollBack();
            throw $e;
        }
    }

    /**
     * Persists this object to the database.
     *
     * If the object is new, it inserts it; otherwise an update is performed.
     * All modified related objects will also be persisted in the doSave()
     * method.  This method wraps all precipitate database operations in a
     * single transaction.
     *
     * @param PropelPDO $con
     * @return int             The number of rows affected by this insert/update and any referring fk objects' save() operations.
     * @throws PropelException
     * @throws Exception
     * @see        doSave()
     */
    public function save(PropelPDO $con = null)
    {
        if ($this->isDeleted()) {
            throw new PropelException("You cannot save an object that has been deleted.");
        }

        if ($con === null) {
            $con = Propel::getConnection(ActionPeer::DATABASE_NAME, Propel::CONNECTION_WRITE);
        }

        $con->beginTransaction();
        $isInsert = $this->isNew();
        try {
            $ret = $this->preSave($con);
            if ($isInsert) {
                $ret = $ret && $this->preInsert($con);
            } else {
                $ret = $ret && $this->preUpdate($con);
            }
            if ($ret) {
                $affectedRows = $this->doSave($con);
                if ($isInsert) {
                    $this->postInsert($con);
                } else {
                    $this->postUpdate($con);
                }
                $this->postSave($con);
                ActionPeer::addInstanceToPool($this);
            } else {
                $affectedRows = 0;
            }
            $con->commit();

            return $affectedRows;
        } catch (Exception $e) {
            $con->rollBack();
            throw $e;
        }
    }

    /**
     * Performs the work of inserting or updating the row in the database.
     *
     * If the object is new, it inserts it; otherwise an update is performed.
     * All related objects are also updated in this method.
     *
     * @param PropelPDO $con
     * @return int             The number of rows affected by this insert/update and any referring fk objects' save() operations.
     * @throws PropelException
     * @see        save()
     */
    protected function doSave(PropelPDO $con)
    {
        $affectedRows = 0; // initialize var to track total num of affected rows
        if (!$this->alreadyInSave) {
            $this->alreadyInSave = true;

            if ($this->isNew() || $this->isModified()) {
                // persist changes
                if ($this->isNew()) {
                    $this->doInsert($con);
                } else {
                    $this->doUpdate($con);
                }
                $affectedRows += 1;
                $this->resetModified();
            }

            if ($this->actionMapsScheduledForDeletion !== null) {
                if (!$this->actionMapsScheduledForDeletion->isEmpty()) {
                    ActionMapQuery::create()
                        ->filterByPrimaryKeys($this->actionMapsScheduledForDeletion->getPrimaryKeys(false))
                        ->delete($con);
                    $this->actionMapsScheduledForDeletion = null;
                }
            }

            if ($this->singleActionMap !== null) {
                if (!$this->singleActionMap->isDeleted() && ($this->singleActionMap->isNew() || $this->singleActionMap->isModified())) {
                        $affectedRows += $this->singleActionMap->save($con);
                }
            }

            if ($this->itemsScheduledForDeletion !== null) {
                if (!$this->itemsScheduledForDeletion->isEmpty()) {
                    ItemQuery::create()
                        ->filterByPrimaryKeys($this->itemsScheduledForDeletion->getPrimaryKeys(false))
                        ->delete($con);
                    $this->itemsScheduledForDeletion = null;
                }
            }

            if ($this->collItems !== null) {
                foreach ($this->collItems as $referrerFK) {
                    if (!$referrerFK->isDeleted() && ($referrerFK->isNew() || $referrerFK->isModified())) {
                        $affectedRows += $referrerFK->save($con);
                    }
                }
            }

            if ($this->feedbacksScheduledForDeletion !== null) {
                if (!$this->feedbacksScheduledForDeletion->isEmpty()) {
                    FeedbackQuery::create()
                        ->filterByPrimaryKeys($this->feedbacksScheduledForDeletion->getPrimaryKeys(false))
                        ->delete($con);
                    $this->feedbacksScheduledForDeletion = null;
                }
            }

            if ($this->collFeedbacks !== null) {
                foreach ($this->collFeedbacks as $referrerFK) {
                    if (!$referrerFK->isDeleted() && ($referrerFK->isNew() || $referrerFK->isModified())) {
                        $affectedRows += $referrerFK->save($con);
                    }
                }
            }

            if ($this->actionI18nsScheduledForDeletion !== null) {
                if (!$this->actionI18nsScheduledForDeletion->isEmpty()) {
                    ActionI18nQuery::create()
                        ->filterByPrimaryKeys($this->actionI18nsScheduledForDeletion->getPrimaryKeys(false))
                        ->delete($con);
                    $this->actionI18nsScheduledForDeletion = null;
                }
            }

            if ($this->collActionI18ns !== null) {
                foreach ($this->collActionI18ns as $referrerFK) {
                    if (!$referrerFK->isDeleted() && ($referrerFK->isNew() || $referrerFK->isModified())) {
                        $affectedRows += $referrerFK->save($con);
                    }
                }
            }

            $this->alreadyInSave = false;

        }

        return $affectedRows;
    } // doSave()

    /**
     * Insert the row in the database.
     *
     * @param PropelPDO $con
     *
     * @throws PropelException
     * @see        doSave()
     */
    protected function doInsert(PropelPDO $con)
    {
        $modifiedColumns = array();
        $index = 0;

        $this->modifiedColumns[] = ActionPeer::ID;
        if (null !== $this->id) {
            throw new PropelException('Cannot insert a value for auto-increment primary key (' . ActionPeer::ID . ')');
        }

         // check the columns in natural order for more readable SQL queries
        if ($this->isColumnModified(ActionPeer::ID)) {
            $modifiedColumns[':p' . $index++]  = '`id`';
        }
        if ($this->isColumnModified(ActionPeer::TYPE)) {
            $modifiedColumns[':p' . $index++]  = '`type`';
        }

        $sql = sprintf(
            'INSERT INTO `action` (%s) VALUES (%s)',
            implode(', ', $modifiedColumns),
            implode(', ', array_keys($modifiedColumns))
        );

        try {
            $stmt = $con->prepare($sql);
            foreach ($modifiedColumns as $identifier => $columnName) {
                switch ($columnName) {
                    case '`id`':
                        $stmt->bindValue($identifier, $this->id, PDO::PARAM_INT);
                        break;
                    case '`type`':
                        $stmt->bindValue($identifier, $this->type, PDO::PARAM_STR);
                        break;
                }
            }
            $stmt->execute();
        } catch (Exception $e) {
            Propel::log($e->getMessage(), Propel::LOG_ERR);
            throw new PropelException(sprintf('Unable to execute INSERT statement [%s]', $sql), $e);
        }

        try {
            $pk = $con->lastInsertId();
        } catch (Exception $e) {
            throw new PropelException('Unable to get autoincrement id.', $e);
        }
        $this->setId($pk);

        $this->setNew(false);
    }

    /**
     * Update the row in the database.
     *
     * @param PropelPDO $con
     *
     * @see        doSave()
     */
    protected function doUpdate(PropelPDO $con)
    {
        $selectCriteria = $this->buildPkeyCriteria();
        $valuesCriteria = $this->buildCriteria();
        BasePeer::doUpdate($selectCriteria, $valuesCriteria, $con);
    }

    /**
     * Array of ValidationFailed objects.
     * @var        array ValidationFailed[]
     */
    protected $validationFailures = array();

    /**
     * Gets any ValidationFailed objects that resulted from last call to validate().
     *
     *
     * @return array ValidationFailed[]
     * @see        validate()
     */
    public function getValidationFailures()
    {
        return $this->validationFailures;
    }

    /**
     * Validates the objects modified field values and all objects related to this table.
     *
     * If $columns is either a column name or an array of column names
     * only those columns are validated.
     *
     * @param mixed $columns Column name or an array of column names.
     * @return boolean Whether all columns pass validation.
     * @see        doValidate()
     * @see        getValidationFailures()
     */
    public function validate($columns = null)
    {
        $res = $this->doValidate($columns);
        if ($res === true) {
            $this->validationFailures = array();

            return true;
        }

        $this->validationFailures = $res;

        return false;
    }

    /**
     * This function performs the validation work for complex object models.
     *
     * In addition to checking the current object, all related objects will
     * also be validated.  If all pass then <code>true</code> is returned; otherwise
     * an aggreagated array of ValidationFailed objects will be returned.
     *
     * @param array $columns Array of column names to validate.
     * @return mixed <code>true</code> if all validations pass; array of <code>ValidationFailed</code> objets otherwise.
     */
    protected function doValidate($columns = null)
    {
        if (!$this->alreadyInValidation) {
            $this->alreadyInValidation = true;
            $retval = null;

            $failureMap = array();


            if (($retval = ActionPeer::doValidate($this, $columns)) !== true) {
                $failureMap = array_merge($failureMap, $retval);
            }


                if ($this->singleActionMap !== null) {
                    if (!$this->singleActionMap->validate($columns)) {
                        $failureMap = array_merge($failureMap, $this->singleActionMap->getValidationFailures());
                    }
                }

                if ($this->collItems !== null) {
                    foreach ($this->collItems as $referrerFK) {
                        if (!$referrerFK->validate($columns)) {
                            $failureMap = array_merge($failureMap, $referrerFK->getValidationFailures());
                        }
                    }
                }

                if ($this->collFeedbacks !== null) {
                    foreach ($this->collFeedbacks as $referrerFK) {
                        if (!$referrerFK->validate($columns)) {
                            $failureMap = array_merge($failureMap, $referrerFK->getValidationFailures());
                        }
                    }
                }

                if ($this->collActionI18ns !== null) {
                    foreach ($this->collActionI18ns as $referrerFK) {
                        if (!$referrerFK->validate($columns)) {
                            $failureMap = array_merge($failureMap, $referrerFK->getValidationFailures());
                        }
                    }
                }


            $this->alreadyInValidation = false;
        }

        return (!empty($failureMap) ? $failureMap : true);
    }

    /**
     * Retrieves a field from the object by name passed in as a string.
     *
     * @param string $name name
     * @param string $type The type of fieldname the $name is of:
     *               one of the class type constants BasePeer::TYPE_PHPNAME, BasePeer::TYPE_STUDLYPHPNAME
     *               BasePeer::TYPE_COLNAME, BasePeer::TYPE_FIELDNAME, BasePeer::TYPE_NUM.
     *               Defaults to BasePeer::TYPE_PHPNAME
     * @return mixed Value of field.
     */
    public function getByName($name, $type = BasePeer::TYPE_PHPNAME)
    {
        $pos = ActionPeer::translateFieldName($name, $type, BasePeer::TYPE_NUM);
        $field = $this->getByPosition($pos);

        return $field;
    }

    /**
     * Retrieves a field from the object by Position as specified in the xml schema.
     * Zero-based.
     *
     * @param int $pos position in xml schema
     * @return mixed Value of field at $pos
     */
    public function getByPosition($pos)
    {
        switch ($pos) {
            case 0:
                return $this->getId();
                break;
            case 1:
                return $this->getType();
                break;
            default:
                return null;
                break;
        } // switch()
    }

    /**
     * Exports the object as an array.
     *
     * You can specify the key type of the array by passing one of the class
     * type constants.
     *
     * @param     string  $keyType (optional) One of the class type constants BasePeer::TYPE_PHPNAME, BasePeer::TYPE_STUDLYPHPNAME,
     *                    BasePeer::TYPE_COLNAME, BasePeer::TYPE_FIELDNAME, BasePeer::TYPE_NUM.
     *                    Defaults to BasePeer::TYPE_PHPNAME.
     * @param     boolean $includeLazyLoadColumns (optional) Whether to include lazy loaded columns. Defaults to true.
     * @param     array $alreadyDumpedObjects List of objects to skip to avoid recursion
     * @param     boolean $includeForeignObjects (optional) Whether to include hydrated related objects. Default to FALSE.
     *
     * @return array an associative array containing the field names (as keys) and field values
     */
    public function toArray($keyType = BasePeer::TYPE_PHPNAME, $includeLazyLoadColumns = true, $alreadyDumpedObjects = array(), $includeForeignObjects = false)
    {
        if (isset($alreadyDumpedObjects['Action'][$this->getPrimaryKey()])) {
            return '*RECURSION*';
        }
        $alreadyDumpedObjects['Action'][$this->getPrimaryKey()] = true;
        $keys = ActionPeer::getFieldNames($keyType);
        $result = array(
            $keys[0] => $this->getId(),
            $keys[1] => $this->getType(),
        );
        if ($includeForeignObjects) {
            if (null !== $this->singleActionMap) {
                $result['ActionMap'] = $this->singleActionMap->toArray($keyType, $includeLazyLoadColumns, $alreadyDumpedObjects, true);
            }
            if (null !== $this->collItems) {
                $result['Items'] = $this->collItems->toArray(null, true, $keyType, $includeLazyLoadColumns, $alreadyDumpedObjects);
            }
            if (null !== $this->collFeedbacks) {
                $result['Feedbacks'] = $this->collFeedbacks->toArray(null, true, $keyType, $includeLazyLoadColumns, $alreadyDumpedObjects);
            }
            if (null !== $this->collActionI18ns) {
                $result['ActionI18ns'] = $this->collActionI18ns->toArray(null, true, $keyType, $includeLazyLoadColumns, $alreadyDumpedObjects);
            }
        }

        return $result;
    }

    /**
     * Sets a field from the object by name passed in as a string.
     *
     * @param string $name peer name
     * @param mixed $value field value
     * @param string $type The type of fieldname the $name is of:
     *                     one of the class type constants BasePeer::TYPE_PHPNAME, BasePeer::TYPE_STUDLYPHPNAME
     *                     BasePeer::TYPE_COLNAME, BasePeer::TYPE_FIELDNAME, BasePeer::TYPE_NUM.
     *                     Defaults to BasePeer::TYPE_PHPNAME
     * @return void
     */
    public function setByName($name, $value, $type = BasePeer::TYPE_PHPNAME)
    {
        $pos = ActionPeer::translateFieldName($name, $type, BasePeer::TYPE_NUM);

        $this->setByPosition($pos, $value);
    }

    /**
     * Sets a field from the object by Position as specified in the xml schema.
     * Zero-based.
     *
     * @param int $pos position in xml schema
     * @param mixed $value field value
     * @return void
     */
    public function setByPosition($pos, $value)
    {
        switch ($pos) {
            case 0:
                $this->setId($value);
                break;
            case 1:
                $this->setType($value);
                break;
        } // switch()
    }

    /**
     * Populates the object using an array.
     *
     * This is particularly useful when populating an object from one of the
     * request arrays (e.g. $_POST).  This method goes through the column
     * names, checking to see whether a matching key exists in populated
     * array. If so the setByName() method is called for that column.
     *
     * You can specify the key type of the array by additionally passing one
     * of the class type constants BasePeer::TYPE_PHPNAME, BasePeer::TYPE_STUDLYPHPNAME,
     * BasePeer::TYPE_COLNAME, BasePeer::TYPE_FIELDNAME, BasePeer::TYPE_NUM.
     * The default key type is the column's BasePeer::TYPE_PHPNAME
     *
     * @param array  $arr     An array to populate the object from.
     * @param string $keyType The type of keys the array uses.
     * @return void
     */
    public function fromArray($arr, $keyType = BasePeer::TYPE_PHPNAME)
    {
        $keys = ActionPeer::getFieldNames($keyType);

        if (array_key_exists($keys[0], $arr)) $this->setId($arr[$keys[0]]);
        if (array_key_exists($keys[1], $arr)) $this->setType($arr[$keys[1]]);
    }

    /**
     * Build a Criteria object containing the values of all modified columns in this object.
     *
     * @return Criteria The Criteria object containing all modified values.
     */
    public function buildCriteria()
    {
        $criteria = new Criteria(ActionPeer::DATABASE_NAME);

        if ($this->isColumnModified(ActionPeer::ID)) $criteria->add(ActionPeer::ID, $this->id);
        if ($this->isColumnModified(ActionPeer::TYPE)) $criteria->add(ActionPeer::TYPE, $this->type);

        return $criteria;
    }

    /**
     * Builds a Criteria object containing the primary key for this object.
     *
     * Unlike buildCriteria() this method includes the primary key values regardless
     * of whether or not they have been modified.
     *
     * @return Criteria The Criteria object containing value(s) for primary key(s).
     */
    public function buildPkeyCriteria()
    {
        $criteria = new Criteria(ActionPeer::DATABASE_NAME);
        $criteria->add(ActionPeer::ID, $this->id);

        return $criteria;
    }

    /**
     * Returns the primary key for this object (row).
     * @return int
     */
    public function getPrimaryKey()
    {
        return $this->getId();
    }

    /**
     * Generic method to set the primary key (id column).
     *
     * @param  int $key Primary key.
     * @return void
     */
    public function setPrimaryKey($key)
    {
        $this->setId($key);
    }

    /**
     * Returns true if the primary key for this object is null.
     * @return boolean
     */
    public function isPrimaryKeyNull()
    {

        return null === $this->getId();
    }

    /**
     * Sets contents of passed object to values from current object.
     *
     * If desired, this method can also make copies of all associated (fkey referrers)
     * objects.
     *
     * @param object $copyObj An object of Action (or compatible) type.
     * @param boolean $deepCopy Whether to also copy all rows that refer (by fkey) to the current row.
     * @param boolean $makeNew Whether to reset autoincrement PKs and make the object new.
     * @throws PropelException
     */
    public function copyInto($copyObj, $deepCopy = false, $makeNew = true)
    {
        $copyObj->setType($this->getType());

        if ($deepCopy && !$this->startCopy) {
            // important: temporarily setNew(false) because this affects the behavior of
            // the getter/setter methods for fkey referrer objects.
            $copyObj->setNew(false);
            // store object hash to prevent cycle
            $this->startCopy = true;

            $relObj = $this->getActionMap();
            if ($relObj) {
                $copyObj->setActionMap($relObj->copy($deepCopy));
            }

            foreach ($this->getItems() as $relObj) {
                if ($relObj !== $this) {  // ensure that we don't try to copy a reference to ourselves
                    $copyObj->addItem($relObj->copy($deepCopy));
                }
            }

            foreach ($this->getFeedbacks() as $relObj) {
                if ($relObj !== $this) {  // ensure that we don't try to copy a reference to ourselves
                    $copyObj->addFeedback($relObj->copy($deepCopy));
                }
            }

            foreach ($this->getActionI18ns() as $relObj) {
                if ($relObj !== $this) {  // ensure that we don't try to copy a reference to ourselves
                    $copyObj->addActionI18n($relObj->copy($deepCopy));
                }
            }

            //unflag object copy
            $this->startCopy = false;
        } // if ($deepCopy)

        if ($makeNew) {
            $copyObj->setNew(true);
            $copyObj->setId(NULL); // this is a auto-increment column, so set to default value
        }
    }

    /**
     * Makes a copy of this object that will be inserted as a new row in table when saved.
     * It creates a new object filling in the simple attributes, but skipping any primary
     * keys that are defined for the table.
     *
     * If desired, this method can also make copies of all associated (fkey referrers)
     * objects.
     *
     * @param boolean $deepCopy Whether to also copy all rows that refer (by fkey) to the current row.
     * @return Action Clone of current object.
     * @throws PropelException
     */
    public function copy($deepCopy = false)
    {
        // we use get_class(), because this might be a subclass
        $clazz = get_class($this);
        $copyObj = new $clazz();
        $this->copyInto($copyObj, $deepCopy);

        return $copyObj;
    }

    /**
     * Returns a peer instance associated with this om.
     *
     * Since Peer classes are not to have any instance attributes, this method returns the
     * same instance for all member of this class. The method could therefore
     * be static, but this would prevent one from overriding the behavior.
     *
     * @return ActionPeer
     */
    public function getPeer()
    {
        if (self::$peer === null) {
            self::$peer = new ActionPeer();
        }

        return self::$peer;
    }


    /**
     * Initializes a collection based on the name of a relation.
     * Avoids crafting an 'init[$relationName]s' method name
     * that wouldn't work when StandardEnglishPluralizer is used.
     *
     * @param string $relationName The name of the relation to initialize
     * @return void
     */
    public function initRelation($relationName)
    {
        if ('Item' == $relationName) {
            $this->initItems();
        }
        if ('Feedback' == $relationName) {
            $this->initFeedbacks();
        }
        if ('ActionI18n' == $relationName) {
            $this->initActionI18ns();
        }
    }

    /**
     * Gets a single ActionMap object, which is related to this object by a one-to-one relationship.
     *
     * @param PropelPDO $con optional connection object
     * @return ActionMap
     * @throws PropelException
     */
    public function getActionMap(PropelPDO $con = null)
    {

        if ($this->singleActionMap === null && !$this->isNew()) {
            $this->singleActionMap = ActionMapQuery::create()->findPk($this->getPrimaryKey(), $con);
        }

        return $this->singleActionMap;
    }

    /**
     * Sets a single ActionMap object as related to this object by a one-to-one relationship.
     *
     * @param             ActionMap $v ActionMap
     * @return Action The current object (for fluent API support)
     * @throws PropelException
     */
    public function setActionMap(ActionMap $v = null)
    {
        $this->singleActionMap = $v;

        // Make sure that that the passed-in ActionMap isn't already associated with this object
        if ($v !== null && $v->getAction(null, false) === null) {
            $v->setAction($this);
        }

        return $this;
    }

    /**
     * Clears out the collItems collection
     *
     * This does not modify the database; however, it will remove any associated objects, causing
     * them to be refetched by subsequent calls to accessor method.
     *
     * @return Action The current object (for fluent API support)
     * @see        addItems()
     */
    public function clearItems()
    {
        $this->collItems = null; // important to set this to null since that means it is uninitialized
        $this->collItemsPartial = null;

        return $this;
    }

    /**
     * reset is the collItems collection loaded partially
     *
     * @return void
     */
    public function resetPartialItems($v = true)
    {
        $this->collItemsPartial = $v;
    }

    /**
     * Initializes the collItems collection.
     *
     * By default this just sets the collItems collection to an empty array (like clearcollItems());
     * however, you may wish to override this method in your stub class to provide setting appropriate
     * to your application -- for example, setting the initial array to the values stored in database.
     *
     * @param boolean $overrideExisting If set to true, the method call initializes
     *                                        the collection even if it is not empty
     *
     * @return void
     */
    public function initItems($overrideExisting = true)
    {
        if (null !== $this->collItems && !$overrideExisting) {
            return;
        }
        $this->collItems = new PropelObjectCollection();
        $this->collItems->setModel('Item');
    }

    /**
     * Gets an array of Item objects which contain a foreign key that references this object.
     *
     * If the $criteria is not null, it is used to always fetch the results from the database.
     * Otherwise the results are fetched from the database the first time, then cached.
     * Next time the same method is called without $criteria, the cached collection is returned.
     * If this Action is new, it will return
     * an empty collection or the current collection; the criteria is ignored on a new object.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @return PropelObjectCollection|Item[] List of Item objects
     * @throws PropelException
     */
    public function getItems($criteria = null, PropelPDO $con = null)
    {
        $partial = $this->collItemsPartial && !$this->isNew();
        if (null === $this->collItems || null !== $criteria  || $partial) {
            if ($this->isNew() && null === $this->collItems) {
                // return empty collection
                $this->initItems();
            } else {
                $collItems = ItemQuery::create(null, $criteria)
                    ->filterByAction($this)
                    ->find($con);
                if (null !== $criteria) {
                    if (false !== $this->collItemsPartial && count($collItems)) {
                      $this->initItems(false);

                      foreach($collItems as $obj) {
                        if (false == $this->collItems->contains($obj)) {
                          $this->collItems->append($obj);
                        }
                      }

                      $this->collItemsPartial = true;
                    }

                    $collItems->getInternalIterator()->rewind();
                    return $collItems;
                }

                if($partial && $this->collItems) {
                    foreach($this->collItems as $obj) {
                        if($obj->isNew()) {
                            $collItems[] = $obj;
                        }
                    }
                }

                $this->collItems = $collItems;
                $this->collItemsPartial = false;
            }
        }

        return $this->collItems;
    }

    /**
     * Sets a collection of Item objects related by a one-to-many relationship
     * to the current object.
     * It will also schedule objects for deletion based on a diff between old objects (aka persisted)
     * and new objects from the given Propel collection.
     *
     * @param PropelCollection $items A Propel collection.
     * @param PropelPDO $con Optional connection object
     * @return Action The current object (for fluent API support)
     */
    public function setItems(PropelCollection $items, PropelPDO $con = null)
    {
        $itemsToDelete = $this->getItems(new Criteria(), $con)->diff($items);

        $this->itemsScheduledForDeletion = unserialize(serialize($itemsToDelete));

        foreach ($itemsToDelete as $itemRemoved) {
            $itemRemoved->setAction(null);
        }

        $this->collItems = null;
        foreach ($items as $item) {
            $this->addItem($item);
        }

        $this->collItems = $items;
        $this->collItemsPartial = false;

        return $this;
    }

    /**
     * Returns the number of related Item objects.
     *
     * @param Criteria $criteria
     * @param boolean $distinct
     * @param PropelPDO $con
     * @return int             Count of related Item objects.
     * @throws PropelException
     */
    public function countItems(Criteria $criteria = null, $distinct = false, PropelPDO $con = null)
    {
        $partial = $this->collItemsPartial && !$this->isNew();
        if (null === $this->collItems || null !== $criteria || $partial) {
            if ($this->isNew() && null === $this->collItems) {
                return 0;
            }

            if($partial && !$criteria) {
                return count($this->getItems());
            }
            $query = ItemQuery::create(null, $criteria);
            if ($distinct) {
                $query->distinct();
            }

            return $query
                ->filterByAction($this)
                ->count($con);
        }

        return count($this->collItems);
    }

    /**
     * Method called to associate a Item object to this object
     * through the Item foreign key attribute.
     *
     * @param    Item $l Item
     * @return Action The current object (for fluent API support)
     */
    public function addItem(Item $l)
    {
        if ($this->collItems === null) {
            $this->initItems();
            $this->collItemsPartial = true;
        }
        if (!in_array($l, $this->collItems->getArrayCopy(), true)) { // only add it if the **same** object is not already associated
            $this->doAddItem($l);
        }

        return $this;
    }

    /**
     * @param	Item $item The item object to add.
     */
    protected function doAddItem($item)
    {
        $this->collItems[]= $item;
        $item->setAction($this);
    }

    /**
     * @param	Item $item The item object to remove.
     * @return Action The current object (for fluent API support)
     */
    public function removeItem($item)
    {
        if ($this->getItems()->contains($item)) {
            $this->collItems->remove($this->collItems->search($item));
            if (null === $this->itemsScheduledForDeletion) {
                $this->itemsScheduledForDeletion = clone $this->collItems;
                $this->itemsScheduledForDeletion->clear();
            }
            $this->itemsScheduledForDeletion[]= clone $item;
            $item->setAction(null);
        }

        return $this;
    }


    /**
     * If this collection has already been initialized with
     * an identical criteria, it returns the collection.
     * Otherwise if this Action is new, it will return
     * an empty collection; or if this Action has previously
     * been saved, it will retrieve related Items from storage.
     *
     * This method is protected by default in order to keep the public
     * api reasonable.  You can provide public methods for those you
     * actually need in Action.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @param string $join_behavior optional join type to use (defaults to Criteria::LEFT_JOIN)
     * @return PropelObjectCollection|Item[] List of Item objects
     */
    public function getItemsJoinTrick($criteria = null, $con = null, $join_behavior = Criteria::LEFT_JOIN)
    {
        $query = ItemQuery::create(null, $criteria);
        $query->joinWith('Trick', $join_behavior);

        return $this->getItems($query, $con);
    }


    /**
     * If this collection has already been initialized with
     * an identical criteria, it returns the collection.
     * Otherwise if this Action is new, it will return
     * an empty collection; or if this Action has previously
     * been saved, it will retrieve related Items from storage.
     *
     * This method is protected by default in order to keep the public
     * api reasonable.  You can provide public methods for those you
     * actually need in Action.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @param string $join_behavior optional join type to use (defaults to Criteria::LEFT_JOIN)
     * @return PropelObjectCollection|Item[] List of Item objects
     */
    public function getItemsJoinGroup($criteria = null, $con = null, $join_behavior = Criteria::LEFT_JOIN)
    {
        $query = ItemQuery::create(null, $criteria);
        $query->joinWith('Group', $join_behavior);

        return $this->getItems($query, $con);
    }

    /**
     * Clears out the collFeedbacks collection
     *
     * This does not modify the database; however, it will remove any associated objects, causing
     * them to be refetched by subsequent calls to accessor method.
     *
     * @return Action The current object (for fluent API support)
     * @see        addFeedbacks()
     */
    public function clearFeedbacks()
    {
        $this->collFeedbacks = null; // important to set this to null since that means it is uninitialized
        $this->collFeedbacksPartial = null;

        return $this;
    }

    /**
     * reset is the collFeedbacks collection loaded partially
     *
     * @return void
     */
    public function resetPartialFeedbacks($v = true)
    {
        $this->collFeedbacksPartial = $v;
    }

    /**
     * Initializes the collFeedbacks collection.
     *
     * By default this just sets the collFeedbacks collection to an empty array (like clearcollFeedbacks());
     * however, you may wish to override this method in your stub class to provide setting appropriate
     * to your application -- for example, setting the initial array to the values stored in database.
     *
     * @param boolean $overrideExisting If set to true, the method call initializes
     *                                        the collection even if it is not empty
     *
     * @return void
     */
    public function initFeedbacks($overrideExisting = true)
    {
        if (null !== $this->collFeedbacks && !$overrideExisting) {
            return;
        }
        $this->collFeedbacks = new PropelObjectCollection();
        $this->collFeedbacks->setModel('Feedback');
    }

    /**
     * Gets an array of Feedback objects which contain a foreign key that references this object.
     *
     * If the $criteria is not null, it is used to always fetch the results from the database.
     * Otherwise the results are fetched from the database the first time, then cached.
     * Next time the same method is called without $criteria, the cached collection is returned.
     * If this Action is new, it will return
     * an empty collection or the current collection; the criteria is ignored on a new object.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @return PropelObjectCollection|Feedback[] List of Feedback objects
     * @throws PropelException
     */
    public function getFeedbacks($criteria = null, PropelPDO $con = null)
    {
        $partial = $this->collFeedbacksPartial && !$this->isNew();
        if (null === $this->collFeedbacks || null !== $criteria  || $partial) {
            if ($this->isNew() && null === $this->collFeedbacks) {
                // return empty collection
                $this->initFeedbacks();
            } else {
                $collFeedbacks = FeedbackQuery::create(null, $criteria)
                    ->filterByAction($this)
                    ->find($con);
                if (null !== $criteria) {
                    if (false !== $this->collFeedbacksPartial && count($collFeedbacks)) {
                      $this->initFeedbacks(false);

                      foreach($collFeedbacks as $obj) {
                        if (false == $this->collFeedbacks->contains($obj)) {
                          $this->collFeedbacks->append($obj);
                        }
                      }

                      $this->collFeedbacksPartial = true;
                    }

                    $collFeedbacks->getInternalIterator()->rewind();
                    return $collFeedbacks;
                }

                if($partial && $this->collFeedbacks) {
                    foreach($this->collFeedbacks as $obj) {
                        if($obj->isNew()) {
                            $collFeedbacks[] = $obj;
                        }
                    }
                }

                $this->collFeedbacks = $collFeedbacks;
                $this->collFeedbacksPartial = false;
            }
        }

        return $this->collFeedbacks;
    }

    /**
     * Sets a collection of Feedback objects related by a one-to-many relationship
     * to the current object.
     * It will also schedule objects for deletion based on a diff between old objects (aka persisted)
     * and new objects from the given Propel collection.
     *
     * @param PropelCollection $feedbacks A Propel collection.
     * @param PropelPDO $con Optional connection object
     * @return Action The current object (for fluent API support)
     */
    public function setFeedbacks(PropelCollection $feedbacks, PropelPDO $con = null)
    {
        $feedbacksToDelete = $this->getFeedbacks(new Criteria(), $con)->diff($feedbacks);

        $this->feedbacksScheduledForDeletion = unserialize(serialize($feedbacksToDelete));

        foreach ($feedbacksToDelete as $feedbackRemoved) {
            $feedbackRemoved->setAction(null);
        }

        $this->collFeedbacks = null;
        foreach ($feedbacks as $feedback) {
            $this->addFeedback($feedback);
        }

        $this->collFeedbacks = $feedbacks;
        $this->collFeedbacksPartial = false;

        return $this;
    }

    /**
     * Returns the number of related Feedback objects.
     *
     * @param Criteria $criteria
     * @param boolean $distinct
     * @param PropelPDO $con
     * @return int             Count of related Feedback objects.
     * @throws PropelException
     */
    public function countFeedbacks(Criteria $criteria = null, $distinct = false, PropelPDO $con = null)
    {
        $partial = $this->collFeedbacksPartial && !$this->isNew();
        if (null === $this->collFeedbacks || null !== $criteria || $partial) {
            if ($this->isNew() && null === $this->collFeedbacks) {
                return 0;
            }

            if($partial && !$criteria) {
                return count($this->getFeedbacks());
            }
            $query = FeedbackQuery::create(null, $criteria);
            if ($distinct) {
                $query->distinct();
            }

            return $query
                ->filterByAction($this)
                ->count($con);
        }

        return count($this->collFeedbacks);
    }

    /**
     * Method called to associate a Feedback object to this object
     * through the Feedback foreign key attribute.
     *
     * @param    Feedback $l Feedback
     * @return Action The current object (for fluent API support)
     */
    public function addFeedback(Feedback $l)
    {
        if ($this->collFeedbacks === null) {
            $this->initFeedbacks();
            $this->collFeedbacksPartial = true;
        }
        if (!in_array($l, $this->collFeedbacks->getArrayCopy(), true)) { // only add it if the **same** object is not already associated
            $this->doAddFeedback($l);
        }

        return $this;
    }

    /**
     * @param	Feedback $feedback The feedback object to add.
     */
    protected function doAddFeedback($feedback)
    {
        $this->collFeedbacks[]= $feedback;
        $feedback->setAction($this);
    }

    /**
     * @param	Feedback $feedback The feedback object to remove.
     * @return Action The current object (for fluent API support)
     */
    public function removeFeedback($feedback)
    {
        if ($this->getFeedbacks()->contains($feedback)) {
            $this->collFeedbacks->remove($this->collFeedbacks->search($feedback));
            if (null === $this->feedbacksScheduledForDeletion) {
                $this->feedbacksScheduledForDeletion = clone $this->collFeedbacks;
                $this->feedbacksScheduledForDeletion->clear();
            }
            $this->feedbacksScheduledForDeletion[]= clone $feedback;
            $feedback->setAction(null);
        }

        return $this;
    }


    /**
     * If this collection has already been initialized with
     * an identical criteria, it returns the collection.
     * Otherwise if this Action is new, it will return
     * an empty collection; or if this Action has previously
     * been saved, it will retrieve related Feedbacks from storage.
     *
     * This method is protected by default in order to keep the public
     * api reasonable.  You can provide public methods for those you
     * actually need in Action.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @param string $join_behavior optional join type to use (defaults to Criteria::LEFT_JOIN)
     * @return PropelObjectCollection|Feedback[] List of Feedback objects
     */
    public function getFeedbacksJoinTrick($criteria = null, $con = null, $join_behavior = Criteria::LEFT_JOIN)
    {
        $query = FeedbackQuery::create(null, $criteria);
        $query->joinWith('Trick', $join_behavior);

        return $this->getFeedbacks($query, $con);
    }

    /**
     * Clears out the collActionI18ns collection
     *
     * This does not modify the database; however, it will remove any associated objects, causing
     * them to be refetched by subsequent calls to accessor method.
     *
     * @return Action The current object (for fluent API support)
     * @see        addActionI18ns()
     */
    public function clearActionI18ns()
    {
        $this->collActionI18ns = null; // important to set this to null since that means it is uninitialized
        $this->collActionI18nsPartial = null;

        return $this;
    }

    /**
     * reset is the collActionI18ns collection loaded partially
     *
     * @return void
     */
    public function resetPartialActionI18ns($v = true)
    {
        $this->collActionI18nsPartial = $v;
    }

    /**
     * Initializes the collActionI18ns collection.
     *
     * By default this just sets the collActionI18ns collection to an empty array (like clearcollActionI18ns());
     * however, you may wish to override this method in your stub class to provide setting appropriate
     * to your application -- for example, setting the initial array to the values stored in database.
     *
     * @param boolean $overrideExisting If set to true, the method call initializes
     *                                        the collection even if it is not empty
     *
     * @return void
     */
    public function initActionI18ns($overrideExisting = true)
    {
        if (null !== $this->collActionI18ns && !$overrideExisting) {
            return;
        }
        $this->collActionI18ns = new PropelObjectCollection();
        $this->collActionI18ns->setModel('ActionI18n');
    }

    /**
     * Gets an array of ActionI18n objects which contain a foreign key that references this object.
     *
     * If the $criteria is not null, it is used to always fetch the results from the database.
     * Otherwise the results are fetched from the database the first time, then cached.
     * Next time the same method is called without $criteria, the cached collection is returned.
     * If this Action is new, it will return
     * an empty collection or the current collection; the criteria is ignored on a new object.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @return PropelObjectCollection|ActionI18n[] List of ActionI18n objects
     * @throws PropelException
     */
    public function getActionI18ns($criteria = null, PropelPDO $con = null)
    {
        $partial = $this->collActionI18nsPartial && !$this->isNew();
        if (null === $this->collActionI18ns || null !== $criteria  || $partial) {
            if ($this->isNew() && null === $this->collActionI18ns) {
                // return empty collection
                $this->initActionI18ns();
            } else {
                $collActionI18ns = ActionI18nQuery::create(null, $criteria)
                    ->filterByAction($this)
                    ->find($con);
                if (null !== $criteria) {
                    if (false !== $this->collActionI18nsPartial && count($collActionI18ns)) {
                      $this->initActionI18ns(false);

                      foreach($collActionI18ns as $obj) {
                        if (false == $this->collActionI18ns->contains($obj)) {
                          $this->collActionI18ns->append($obj);
                        }
                      }

                      $this->collActionI18nsPartial = true;
                    }

                    $collActionI18ns->getInternalIterator()->rewind();
                    return $collActionI18ns;
                }

                if($partial && $this->collActionI18ns) {
                    foreach($this->collActionI18ns as $obj) {
                        if($obj->isNew()) {
                            $collActionI18ns[] = $obj;
                        }
                    }
                }

                $this->collActionI18ns = $collActionI18ns;
                $this->collActionI18nsPartial = false;
            }
        }

        return $this->collActionI18ns;
    }

    /**
     * Sets a collection of ActionI18n objects related by a one-to-many relationship
     * to the current object.
     * It will also schedule objects for deletion based on a diff between old objects (aka persisted)
     * and new objects from the given Propel collection.
     *
     * @param PropelCollection $actionI18ns A Propel collection.
     * @param PropelPDO $con Optional connection object
     * @return Action The current object (for fluent API support)
     */
    public function setActionI18ns(PropelCollection $actionI18ns, PropelPDO $con = null)
    {
        $actionI18nsToDelete = $this->getActionI18ns(new Criteria(), $con)->diff($actionI18ns);

        $this->actionI18nsScheduledForDeletion = unserialize(serialize($actionI18nsToDelete));

        foreach ($actionI18nsToDelete as $actionI18nRemoved) {
            $actionI18nRemoved->setAction(null);
        }

        $this->collActionI18ns = null;
        foreach ($actionI18ns as $actionI18n) {
            $this->addActionI18n($actionI18n);
        }

        $this->collActionI18ns = $actionI18ns;
        $this->collActionI18nsPartial = false;

        return $this;
    }

    /**
     * Returns the number of related ActionI18n objects.
     *
     * @param Criteria $criteria
     * @param boolean $distinct
     * @param PropelPDO $con
     * @return int             Count of related ActionI18n objects.
     * @throws PropelException
     */
    public function countActionI18ns(Criteria $criteria = null, $distinct = false, PropelPDO $con = null)
    {
        $partial = $this->collActionI18nsPartial && !$this->isNew();
        if (null === $this->collActionI18ns || null !== $criteria || $partial) {
            if ($this->isNew() && null === $this->collActionI18ns) {
                return 0;
            }

            if($partial && !$criteria) {
                return count($this->getActionI18ns());
            }
            $query = ActionI18nQuery::create(null, $criteria);
            if ($distinct) {
                $query->distinct();
            }

            return $query
                ->filterByAction($this)
                ->count($con);
        }

        return count($this->collActionI18ns);
    }

    /**
     * Method called to associate a ActionI18n object to this object
     * through the ActionI18n foreign key attribute.
     *
     * @param    ActionI18n $l ActionI18n
     * @return Action The current object (for fluent API support)
     */
    public function addActionI18n(ActionI18n $l)
    {
        if ($l && $locale = $l->getLocale()) {
            $this->setLocale($locale);
            $this->currentTranslations[$locale] = $l;
        }
        if ($this->collActionI18ns === null) {
            $this->initActionI18ns();
            $this->collActionI18nsPartial = true;
        }
        if (!in_array($l, $this->collActionI18ns->getArrayCopy(), true)) { // only add it if the **same** object is not already associated
            $this->doAddActionI18n($l);
        }

        return $this;
    }

    /**
     * @param	ActionI18n $actionI18n The actionI18n object to add.
     */
    protected function doAddActionI18n($actionI18n)
    {
        $this->collActionI18ns[]= $actionI18n;
        $actionI18n->setAction($this);
    }

    /**
     * @param	ActionI18n $actionI18n The actionI18n object to remove.
     * @return Action The current object (for fluent API support)
     */
    public function removeActionI18n($actionI18n)
    {
        if ($this->getActionI18ns()->contains($actionI18n)) {
            $this->collActionI18ns->remove($this->collActionI18ns->search($actionI18n));
            if (null === $this->actionI18nsScheduledForDeletion) {
                $this->actionI18nsScheduledForDeletion = clone $this->collActionI18ns;
                $this->actionI18nsScheduledForDeletion->clear();
            }
            $this->actionI18nsScheduledForDeletion[]= clone $actionI18n;
            $actionI18n->setAction(null);
        }

        return $this;
    }

    /**
     * Clears the current object and sets all attributes to their default values
     */
    public function clear()
    {
        $this->id = null;
        $this->type = null;
        $this->alreadyInSave = false;
        $this->alreadyInValidation = false;
        $this->alreadyInClearAllReferencesDeep = false;
        $this->clearAllReferences();
        $this->applyDefaultValues();
        $this->resetModified();
        $this->setNew(true);
        $this->setDeleted(false);
    }

    /**
     * Resets all references to other model objects or collections of model objects.
     *
     * This method is a user-space workaround for PHP's inability to garbage collect
     * objects with circular references (even in PHP 5.3). This is currently necessary
     * when using Propel in certain daemon or large-volumne/high-memory operations.
     *
     * @param boolean $deep Whether to also clear the references on all referrer objects.
     */
    public function clearAllReferences($deep = false)
    {
        if ($deep && !$this->alreadyInClearAllReferencesDeep) {
            $this->alreadyInClearAllReferencesDeep = true;
            if ($this->singleActionMap) {
                $this->singleActionMap->clearAllReferences($deep);
            }
            if ($this->collItems) {
                foreach ($this->collItems as $o) {
                    $o->clearAllReferences($deep);
                }
            }
            if ($this->collFeedbacks) {
                foreach ($this->collFeedbacks as $o) {
                    $o->clearAllReferences($deep);
                }
            }
            if ($this->collActionI18ns) {
                foreach ($this->collActionI18ns as $o) {
                    $o->clearAllReferences($deep);
                }
            }

            $this->alreadyInClearAllReferencesDeep = false;
        } // if ($deep)

        // i18n behavior
        $this->currentLocale = 'de';
        $this->currentTranslations = null;

        if ($this->singleActionMap instanceof PropelCollection) {
            $this->singleActionMap->clearIterator();
        }
        $this->singleActionMap = null;
        if ($this->collItems instanceof PropelCollection) {
            $this->collItems->clearIterator();
        }
        $this->collItems = null;
        if ($this->collFeedbacks instanceof PropelCollection) {
            $this->collFeedbacks->clearIterator();
        }
        $this->collFeedbacks = null;
        if ($this->collActionI18ns instanceof PropelCollection) {
            $this->collActionI18ns->clearIterator();
        }
        $this->collActionI18ns = null;
    }

    /**
     * return the string representation of this object
     *
     * @return string
     */
    public function __toString()
    {
        return (string) $this->exportTo(ActionPeer::DEFAULT_STRING_FORMAT);
    }

    /**
     * return true is the object is in saving state
     *
     * @return boolean
     */
    public function isAlreadyInSave()
    {
        return $this->alreadyInSave;
    }

    // i18n behavior

    /**
     * Sets the locale for translations
     *
     * @param     string $locale Locale to use for the translation, e.g. 'fr_FR'
     *
     * @return    Action The current object (for fluent API support)
     */
    public function setLocale($locale = 'de')
    {
        $this->currentLocale = $locale;

        return $this;
    }

    /**
     * Gets the locale for translations
     *
     * @return    string $locale Locale to use for the translation, e.g. 'fr_FR'
     */
    public function getLocale()
    {
        return $this->currentLocale;
    }

    /**
     * Returns the current translation for a given locale
     *
     * @param     string $locale Locale to use for the translation, e.g. 'fr_FR'
     * @param     PropelPDO $con an optional connection object
     *
     * @return ActionI18n */
    public function getTranslation($locale = 'de', PropelPDO $con = null)
    {
        if (!isset($this->currentTranslations[$locale])) {
            if (null !== $this->collActionI18ns) {
                foreach ($this->collActionI18ns as $translation) {
                    if ($translation->getLocale() == $locale) {
                        $this->currentTranslations[$locale] = $translation;

                        return $translation;
                    }
                }
            }
            if ($this->isNew()) {
                $translation = new ActionI18n();
                $translation->setLocale($locale);
            } else {
                $translation = ActionI18nQuery::create()
                    ->filterByPrimaryKey(array($this->getPrimaryKey(), $locale))
                    ->findOneOrCreate($con);
                $this->currentTranslations[$locale] = $translation;
            }
            $this->addActionI18n($translation);
        }

        return $this->currentTranslations[$locale];
    }

    /**
     * Remove the translation for a given locale
     *
     * @param     string $locale Locale to use for the translation, e.g. 'fr_FR'
     * @param     PropelPDO $con an optional connection object
     *
     * @return    Action The current object (for fluent API support)
     */
    public function removeTranslation($locale = 'de', PropelPDO $con = null)
    {
        if (!$this->isNew()) {
            ActionI18nQuery::create()
                ->filterByPrimaryKey(array($this->getPrimaryKey(), $locale))
                ->delete($con);
        }
        if (isset($this->currentTranslations[$locale])) {
            unset($this->currentTranslations[$locale]);
        }
        foreach ($this->collActionI18ns as $key => $translation) {
            if ($translation->getLocale() == $locale) {
                unset($this->collActionI18ns[$key]);
                break;
            }
        }

        return $this;
    }

    /**
     * Returns the current translation
     *
     * @param     PropelPDO $con an optional connection object
     *
     * @return ActionI18n */
    public function getCurrentTranslation(PropelPDO $con = null)
    {
        return $this->getTranslation($this->getLocale(), $con);
    }


        /**
         * Get the [title] column value.
         *
         * @return string
         */
        public function getTitle()
        {
        return $this->getCurrentTranslation()->getTitle();
    }


        /**
         * Set the value of [title] column.
         *
         * @param string $v new value
         * @return ActionI18n The current object (for fluent API support)
         */
        public function setTitle($v)
        {    $this->getCurrentTranslation()->setTitle($v);

        return $this;
    }


        /**
         * Get the [description] column value.
         *
         * @return string
         */
        public function getDescription()
        {
        return $this->getCurrentTranslation()->getDescription();
    }


        /**
         * Set the value of [description] column.
         *
         * @param string $v new value
         * @return ActionI18n The current object (for fluent API support)
         */
        public function setDescription($v)
        {    $this->getCurrentTranslation()->setDescription($v);

        return $this;
    }

}
