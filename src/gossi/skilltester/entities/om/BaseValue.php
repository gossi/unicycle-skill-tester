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
use gossi\skilltester\entities\Feedback;
use gossi\skilltester\entities\FeedbackQuery;
use gossi\skilltester\entities\Value;
use gossi\skilltester\entities\ValueI18n;
use gossi\skilltester\entities\ValueI18nQuery;
use gossi\skilltester\entities\ValuePeer;
use gossi\skilltester\entities\ValueQuery;

/**
 * Base class that represents a row from the 'value' table.
 *
 *
 *
 * @package    propel.generator.gossi.skilltester.entities.om
 */
abstract class BaseValue extends BaseObject implements Persistent
{
    /**
     * Peer class name
     */
    const PEER = 'gossi\\skilltester\\entities\\ValuePeer';

    /**
     * The Peer class.
     * Instance provides a convenient way of calling static methods on a class
     * that calling code may not be able to identify.
     * @var        ValuePeer
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
     * The value for the feedback_id field.
     * @var        int
     */
    protected $feedback_id;

    /**
     * The value for the value field.
     * @var        string
     */
    protected $value;

    /**
     * The value for the range field.
     * @var        string
     */
    protected $range;

    /**
     * The value for the mistake field.
     * @var        string
     */
    protected $mistake;

    /**
     * @var        Feedback
     */
    protected $aFeedback;

    /**
     * @var        PropelObjectCollection|ValueI18n[] Collection to store aggregation of ValueI18n objects.
     */
    protected $collValueI18ns;
    protected $collValueI18nsPartial;

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
     * @var        array[ValueI18n]
     */
    protected $currentTranslations;

    /**
     * An array of objects scheduled for deletion.
     * @var		PropelObjectCollection
     */
    protected $valueI18nsScheduledForDeletion = null;

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
     * Get the [feedback_id] column value.
     *
     * @return int
     */
    public function getFeedbackId()
    {
        return $this->feedback_id;
    }

    /**
     * Get the [value] column value.
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * Get the [range] column value.
     *
     * @return string
     */
    public function getRange()
    {
        return $this->range;
    }

    /**
     * Get the [mistake] column value.
     *
     * @return string
     */
    public function getMistake()
    {
        return $this->mistake;
    }

    /**
     * Set the value of [id] column.
     *
     * @param int $v new value
     * @return Value The current object (for fluent API support)
     */
    public function setId($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->id !== $v) {
            $this->id = $v;
            $this->modifiedColumns[] = ValuePeer::ID;
        }


        return $this;
    } // setId()

    /**
     * Set the value of [feedback_id] column.
     *
     * @param int $v new value
     * @return Value The current object (for fluent API support)
     */
    public function setFeedbackId($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->feedback_id !== $v) {
            $this->feedback_id = $v;
            $this->modifiedColumns[] = ValuePeer::FEEDBACK_ID;
        }

        if ($this->aFeedback !== null && $this->aFeedback->getId() !== $v) {
            $this->aFeedback = null;
        }


        return $this;
    } // setFeedbackId()

    /**
     * Set the value of [value] column.
     *
     * @param string $v new value
     * @return Value The current object (for fluent API support)
     */
    public function setValue($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (string) $v;
        }

        if ($this->value !== $v) {
            $this->value = $v;
            $this->modifiedColumns[] = ValuePeer::VALUE;
        }


        return $this;
    } // setValue()

    /**
     * Set the value of [range] column.
     *
     * @param string $v new value
     * @return Value The current object (for fluent API support)
     */
    public function setRange($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (string) $v;
        }

        if ($this->range !== $v) {
            $this->range = $v;
            $this->modifiedColumns[] = ValuePeer::RANGE;
        }


        return $this;
    } // setRange()

    /**
     * Set the value of [mistake] column.
     *
     * @param string $v new value
     * @return Value The current object (for fluent API support)
     */
    public function setMistake($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (string) $v;
        }

        if ($this->mistake !== $v) {
            $this->mistake = $v;
            $this->modifiedColumns[] = ValuePeer::MISTAKE;
        }


        return $this;
    } // setMistake()

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
            $this->feedback_id = ($row[$startcol + 1] !== null) ? (int) $row[$startcol + 1] : null;
            $this->value = ($row[$startcol + 2] !== null) ? (string) $row[$startcol + 2] : null;
            $this->range = ($row[$startcol + 3] !== null) ? (string) $row[$startcol + 3] : null;
            $this->mistake = ($row[$startcol + 4] !== null) ? (string) $row[$startcol + 4] : null;
            $this->resetModified();

            $this->setNew(false);

            if ($rehydrate) {
                $this->ensureConsistency();
            }
            $this->postHydrate($row, $startcol, $rehydrate);
            return $startcol + 5; // 5 = ValuePeer::NUM_HYDRATE_COLUMNS.

        } catch (Exception $e) {
            throw new PropelException("Error populating Value object", $e);
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

        if ($this->aFeedback !== null && $this->feedback_id !== $this->aFeedback->getId()) {
            $this->aFeedback = null;
        }
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
            $con = Propel::getConnection(ValuePeer::DATABASE_NAME, Propel::CONNECTION_READ);
        }

        // We don't need to alter the object instance pool; we're just modifying this instance
        // already in the pool.

        $stmt = ValuePeer::doSelectStmt($this->buildPkeyCriteria(), $con);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        $stmt->closeCursor();
        if (!$row) {
            throw new PropelException('Cannot find matching row in the database to reload object values.');
        }
        $this->hydrate($row, 0, true); // rehydrate

        if ($deep) {  // also de-associate any related objects?

            $this->aFeedback = null;
            $this->collValueI18ns = null;

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
            $con = Propel::getConnection(ValuePeer::DATABASE_NAME, Propel::CONNECTION_WRITE);
        }

        $con->beginTransaction();
        try {
            $deleteQuery = ValueQuery::create()
                ->filterByPrimaryKey($this->getPrimaryKey());
            $ret = $this->preDelete($con);
            if ($ret) {
                $deleteQuery->delete($con);
                $this->postDelete($con);
                // i18n behavior

                // emulate delete cascade
                ValueI18nQuery::create()
                    ->filterByValue($this)
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
            $con = Propel::getConnection(ValuePeer::DATABASE_NAME, Propel::CONNECTION_WRITE);
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
                ValuePeer::addInstanceToPool($this);
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

            // We call the save method on the following object(s) if they
            // were passed to this object by their coresponding set
            // method.  This object relates to these object(s) by a
            // foreign key reference.

            if ($this->aFeedback !== null) {
                if ($this->aFeedback->isModified() || $this->aFeedback->isNew()) {
                    $affectedRows += $this->aFeedback->save($con);
                }
                $this->setFeedback($this->aFeedback);
            }

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

            if ($this->valueI18nsScheduledForDeletion !== null) {
                if (!$this->valueI18nsScheduledForDeletion->isEmpty()) {
                    ValueI18nQuery::create()
                        ->filterByPrimaryKeys($this->valueI18nsScheduledForDeletion->getPrimaryKeys(false))
                        ->delete($con);
                    $this->valueI18nsScheduledForDeletion = null;
                }
            }

            if ($this->collValueI18ns !== null) {
                foreach ($this->collValueI18ns as $referrerFK) {
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

        $this->modifiedColumns[] = ValuePeer::ID;
        if (null !== $this->id) {
            throw new PropelException('Cannot insert a value for auto-increment primary key (' . ValuePeer::ID . ')');
        }

         // check the columns in natural order for more readable SQL queries
        if ($this->isColumnModified(ValuePeer::ID)) {
            $modifiedColumns[':p' . $index++]  = '`id`';
        }
        if ($this->isColumnModified(ValuePeer::FEEDBACK_ID)) {
            $modifiedColumns[':p' . $index++]  = '`feedback_id`';
        }
        if ($this->isColumnModified(ValuePeer::VALUE)) {
            $modifiedColumns[':p' . $index++]  = '`value`';
        }
        if ($this->isColumnModified(ValuePeer::RANGE)) {
            $modifiedColumns[':p' . $index++]  = '`range`';
        }
        if ($this->isColumnModified(ValuePeer::MISTAKE)) {
            $modifiedColumns[':p' . $index++]  = '`mistake`';
        }

        $sql = sprintf(
            'INSERT INTO `value` (%s) VALUES (%s)',
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
                    case '`feedback_id`':
                        $stmt->bindValue($identifier, $this->feedback_id, PDO::PARAM_INT);
                        break;
                    case '`value`':
                        $stmt->bindValue($identifier, $this->value, PDO::PARAM_STR);
                        break;
                    case '`range`':
                        $stmt->bindValue($identifier, $this->range, PDO::PARAM_STR);
                        break;
                    case '`mistake`':
                        $stmt->bindValue($identifier, $this->mistake, PDO::PARAM_STR);
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


            // We call the validate method on the following object(s) if they
            // were passed to this object by their coresponding set
            // method.  This object relates to these object(s) by a
            // foreign key reference.

            if ($this->aFeedback !== null) {
                if (!$this->aFeedback->validate($columns)) {
                    $failureMap = array_merge($failureMap, $this->aFeedback->getValidationFailures());
                }
            }


            if (($retval = ValuePeer::doValidate($this, $columns)) !== true) {
                $failureMap = array_merge($failureMap, $retval);
            }


                if ($this->collValueI18ns !== null) {
                    foreach ($this->collValueI18ns as $referrerFK) {
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
        $pos = ValuePeer::translateFieldName($name, $type, BasePeer::TYPE_NUM);
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
                return $this->getFeedbackId();
                break;
            case 2:
                return $this->getValue();
                break;
            case 3:
                return $this->getRange();
                break;
            case 4:
                return $this->getMistake();
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
        if (isset($alreadyDumpedObjects['Value'][$this->getPrimaryKey()])) {
            return '*RECURSION*';
        }
        $alreadyDumpedObjects['Value'][$this->getPrimaryKey()] = true;
        $keys = ValuePeer::getFieldNames($keyType);
        $result = array(
            $keys[0] => $this->getId(),
            $keys[1] => $this->getFeedbackId(),
            $keys[2] => $this->getValue(),
            $keys[3] => $this->getRange(),
            $keys[4] => $this->getMistake(),
        );
        if ($includeForeignObjects) {
            if (null !== $this->aFeedback) {
                $result['Feedback'] = $this->aFeedback->toArray($keyType, $includeLazyLoadColumns,  $alreadyDumpedObjects, true);
            }
            if (null !== $this->collValueI18ns) {
                $result['ValueI18ns'] = $this->collValueI18ns->toArray(null, true, $keyType, $includeLazyLoadColumns, $alreadyDumpedObjects);
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
        $pos = ValuePeer::translateFieldName($name, $type, BasePeer::TYPE_NUM);

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
                $this->setFeedbackId($value);
                break;
            case 2:
                $this->setValue($value);
                break;
            case 3:
                $this->setRange($value);
                break;
            case 4:
                $this->setMistake($value);
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
        $keys = ValuePeer::getFieldNames($keyType);

        if (array_key_exists($keys[0], $arr)) $this->setId($arr[$keys[0]]);
        if (array_key_exists($keys[1], $arr)) $this->setFeedbackId($arr[$keys[1]]);
        if (array_key_exists($keys[2], $arr)) $this->setValue($arr[$keys[2]]);
        if (array_key_exists($keys[3], $arr)) $this->setRange($arr[$keys[3]]);
        if (array_key_exists($keys[4], $arr)) $this->setMistake($arr[$keys[4]]);
    }

    /**
     * Build a Criteria object containing the values of all modified columns in this object.
     *
     * @return Criteria The Criteria object containing all modified values.
     */
    public function buildCriteria()
    {
        $criteria = new Criteria(ValuePeer::DATABASE_NAME);

        if ($this->isColumnModified(ValuePeer::ID)) $criteria->add(ValuePeer::ID, $this->id);
        if ($this->isColumnModified(ValuePeer::FEEDBACK_ID)) $criteria->add(ValuePeer::FEEDBACK_ID, $this->feedback_id);
        if ($this->isColumnModified(ValuePeer::VALUE)) $criteria->add(ValuePeer::VALUE, $this->value);
        if ($this->isColumnModified(ValuePeer::RANGE)) $criteria->add(ValuePeer::RANGE, $this->range);
        if ($this->isColumnModified(ValuePeer::MISTAKE)) $criteria->add(ValuePeer::MISTAKE, $this->mistake);

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
        $criteria = new Criteria(ValuePeer::DATABASE_NAME);
        $criteria->add(ValuePeer::ID, $this->id);

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
     * @param object $copyObj An object of Value (or compatible) type.
     * @param boolean $deepCopy Whether to also copy all rows that refer (by fkey) to the current row.
     * @param boolean $makeNew Whether to reset autoincrement PKs and make the object new.
     * @throws PropelException
     */
    public function copyInto($copyObj, $deepCopy = false, $makeNew = true)
    {
        $copyObj->setFeedbackId($this->getFeedbackId());
        $copyObj->setValue($this->getValue());
        $copyObj->setRange($this->getRange());
        $copyObj->setMistake($this->getMistake());

        if ($deepCopy && !$this->startCopy) {
            // important: temporarily setNew(false) because this affects the behavior of
            // the getter/setter methods for fkey referrer objects.
            $copyObj->setNew(false);
            // store object hash to prevent cycle
            $this->startCopy = true;

            foreach ($this->getValueI18ns() as $relObj) {
                if ($relObj !== $this) {  // ensure that we don't try to copy a reference to ourselves
                    $copyObj->addValueI18n($relObj->copy($deepCopy));
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
     * @return Value Clone of current object.
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
     * @return ValuePeer
     */
    public function getPeer()
    {
        if (self::$peer === null) {
            self::$peer = new ValuePeer();
        }

        return self::$peer;
    }

    /**
     * Declares an association between this object and a Feedback object.
     *
     * @param             Feedback $v
     * @return Value The current object (for fluent API support)
     * @throws PropelException
     */
    public function setFeedback(Feedback $v = null)
    {
        if ($v === null) {
            $this->setFeedbackId(NULL);
        } else {
            $this->setFeedbackId($v->getId());
        }

        $this->aFeedback = $v;

        // Add binding for other direction of this n:n relationship.
        // If this object has already been added to the Feedback object, it will not be re-added.
        if ($v !== null) {
            $v->addValue($this);
        }


        return $this;
    }


    /**
     * Get the associated Feedback object
     *
     * @param PropelPDO $con Optional Connection object.
     * @param $doQuery Executes a query to get the object if required
     * @return Feedback The associated Feedback object.
     * @throws PropelException
     */
    public function getFeedback(PropelPDO $con = null, $doQuery = true)
    {
        if ($this->aFeedback === null && ($this->feedback_id !== null) && $doQuery) {
            $this->aFeedback = FeedbackQuery::create()->findPk($this->feedback_id, $con);
            /* The following can be used additionally to
                guarantee the related object contains a reference
                to this object.  This level of coupling may, however, be
                undesirable since it could result in an only partially populated collection
                in the referenced object.
                $this->aFeedback->addValues($this);
             */
        }

        return $this->aFeedback;
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
        if ('ValueI18n' == $relationName) {
            $this->initValueI18ns();
        }
    }

    /**
     * Clears out the collValueI18ns collection
     *
     * This does not modify the database; however, it will remove any associated objects, causing
     * them to be refetched by subsequent calls to accessor method.
     *
     * @return Value The current object (for fluent API support)
     * @see        addValueI18ns()
     */
    public function clearValueI18ns()
    {
        $this->collValueI18ns = null; // important to set this to null since that means it is uninitialized
        $this->collValueI18nsPartial = null;

        return $this;
    }

    /**
     * reset is the collValueI18ns collection loaded partially
     *
     * @return void
     */
    public function resetPartialValueI18ns($v = true)
    {
        $this->collValueI18nsPartial = $v;
    }

    /**
     * Initializes the collValueI18ns collection.
     *
     * By default this just sets the collValueI18ns collection to an empty array (like clearcollValueI18ns());
     * however, you may wish to override this method in your stub class to provide setting appropriate
     * to your application -- for example, setting the initial array to the values stored in database.
     *
     * @param boolean $overrideExisting If set to true, the method call initializes
     *                                        the collection even if it is not empty
     *
     * @return void
     */
    public function initValueI18ns($overrideExisting = true)
    {
        if (null !== $this->collValueI18ns && !$overrideExisting) {
            return;
        }
        $this->collValueI18ns = new PropelObjectCollection();
        $this->collValueI18ns->setModel('ValueI18n');
    }

    /**
     * Gets an array of ValueI18n objects which contain a foreign key that references this object.
     *
     * If the $criteria is not null, it is used to always fetch the results from the database.
     * Otherwise the results are fetched from the database the first time, then cached.
     * Next time the same method is called without $criteria, the cached collection is returned.
     * If this Value is new, it will return
     * an empty collection or the current collection; the criteria is ignored on a new object.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @return PropelObjectCollection|ValueI18n[] List of ValueI18n objects
     * @throws PropelException
     */
    public function getValueI18ns($criteria = null, PropelPDO $con = null)
    {
        $partial = $this->collValueI18nsPartial && !$this->isNew();
        if (null === $this->collValueI18ns || null !== $criteria  || $partial) {
            if ($this->isNew() && null === $this->collValueI18ns) {
                // return empty collection
                $this->initValueI18ns();
            } else {
                $collValueI18ns = ValueI18nQuery::create(null, $criteria)
                    ->filterByValue($this)
                    ->find($con);
                if (null !== $criteria) {
                    if (false !== $this->collValueI18nsPartial && count($collValueI18ns)) {
                      $this->initValueI18ns(false);

                      foreach($collValueI18ns as $obj) {
                        if (false == $this->collValueI18ns->contains($obj)) {
                          $this->collValueI18ns->append($obj);
                        }
                      }

                      $this->collValueI18nsPartial = true;
                    }

                    $collValueI18ns->getInternalIterator()->rewind();
                    return $collValueI18ns;
                }

                if($partial && $this->collValueI18ns) {
                    foreach($this->collValueI18ns as $obj) {
                        if($obj->isNew()) {
                            $collValueI18ns[] = $obj;
                        }
                    }
                }

                $this->collValueI18ns = $collValueI18ns;
                $this->collValueI18nsPartial = false;
            }
        }

        return $this->collValueI18ns;
    }

    /**
     * Sets a collection of ValueI18n objects related by a one-to-many relationship
     * to the current object.
     * It will also schedule objects for deletion based on a diff between old objects (aka persisted)
     * and new objects from the given Propel collection.
     *
     * @param PropelCollection $valueI18ns A Propel collection.
     * @param PropelPDO $con Optional connection object
     * @return Value The current object (for fluent API support)
     */
    public function setValueI18ns(PropelCollection $valueI18ns, PropelPDO $con = null)
    {
        $valueI18nsToDelete = $this->getValueI18ns(new Criteria(), $con)->diff($valueI18ns);

        $this->valueI18nsScheduledForDeletion = unserialize(serialize($valueI18nsToDelete));

        foreach ($valueI18nsToDelete as $valueI18nRemoved) {
            $valueI18nRemoved->setValue(null);
        }

        $this->collValueI18ns = null;
        foreach ($valueI18ns as $valueI18n) {
            $this->addValueI18n($valueI18n);
        }

        $this->collValueI18ns = $valueI18ns;
        $this->collValueI18nsPartial = false;

        return $this;
    }

    /**
     * Returns the number of related ValueI18n objects.
     *
     * @param Criteria $criteria
     * @param boolean $distinct
     * @param PropelPDO $con
     * @return int             Count of related ValueI18n objects.
     * @throws PropelException
     */
    public function countValueI18ns(Criteria $criteria = null, $distinct = false, PropelPDO $con = null)
    {
        $partial = $this->collValueI18nsPartial && !$this->isNew();
        if (null === $this->collValueI18ns || null !== $criteria || $partial) {
            if ($this->isNew() && null === $this->collValueI18ns) {
                return 0;
            }

            if($partial && !$criteria) {
                return count($this->getValueI18ns());
            }
            $query = ValueI18nQuery::create(null, $criteria);
            if ($distinct) {
                $query->distinct();
            }

            return $query
                ->filterByValue($this)
                ->count($con);
        }

        return count($this->collValueI18ns);
    }

    /**
     * Method called to associate a ValueI18n object to this object
     * through the ValueI18n foreign key attribute.
     *
     * @param    ValueI18n $l ValueI18n
     * @return Value The current object (for fluent API support)
     */
    public function addValueI18n(ValueI18n $l)
    {
        if ($l && $locale = $l->getLocale()) {
            $this->setLocale($locale);
            $this->currentTranslations[$locale] = $l;
        }
        if ($this->collValueI18ns === null) {
            $this->initValueI18ns();
            $this->collValueI18nsPartial = true;
        }
        if (!in_array($l, $this->collValueI18ns->getArrayCopy(), true)) { // only add it if the **same** object is not already associated
            $this->doAddValueI18n($l);
        }

        return $this;
    }

    /**
     * @param	ValueI18n $valueI18n The valueI18n object to add.
     */
    protected function doAddValueI18n($valueI18n)
    {
        $this->collValueI18ns[]= $valueI18n;
        $valueI18n->setValue($this);
    }

    /**
     * @param	ValueI18n $valueI18n The valueI18n object to remove.
     * @return Value The current object (for fluent API support)
     */
    public function removeValueI18n($valueI18n)
    {
        if ($this->getValueI18ns()->contains($valueI18n)) {
            $this->collValueI18ns->remove($this->collValueI18ns->search($valueI18n));
            if (null === $this->valueI18nsScheduledForDeletion) {
                $this->valueI18nsScheduledForDeletion = clone $this->collValueI18ns;
                $this->valueI18nsScheduledForDeletion->clear();
            }
            $this->valueI18nsScheduledForDeletion[]= clone $valueI18n;
            $valueI18n->setValue(null);
        }

        return $this;
    }

    /**
     * Clears the current object and sets all attributes to their default values
     */
    public function clear()
    {
        $this->id = null;
        $this->feedback_id = null;
        $this->value = null;
        $this->range = null;
        $this->mistake = null;
        $this->alreadyInSave = false;
        $this->alreadyInValidation = false;
        $this->alreadyInClearAllReferencesDeep = false;
        $this->clearAllReferences();
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
            if ($this->collValueI18ns) {
                foreach ($this->collValueI18ns as $o) {
                    $o->clearAllReferences($deep);
                }
            }
            if ($this->aFeedback instanceof Persistent) {
              $this->aFeedback->clearAllReferences($deep);
            }

            $this->alreadyInClearAllReferencesDeep = false;
        } // if ($deep)

        // i18n behavior
        $this->currentLocale = 'de';
        $this->currentTranslations = null;

        if ($this->collValueI18ns instanceof PropelCollection) {
            $this->collValueI18ns->clearIterator();
        }
        $this->collValueI18ns = null;
        $this->aFeedback = null;
    }

    /**
     * return the string representation of this object
     *
     * @return string
     */
    public function __toString()
    {
        return (string) $this->exportTo(ValuePeer::DEFAULT_STRING_FORMAT);
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
     * @return    Value The current object (for fluent API support)
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
     * @return ValueI18n */
    public function getTranslation($locale = 'de', PropelPDO $con = null)
    {
        if (!isset($this->currentTranslations[$locale])) {
            if (null !== $this->collValueI18ns) {
                foreach ($this->collValueI18ns as $translation) {
                    if ($translation->getLocale() == $locale) {
                        $this->currentTranslations[$locale] = $translation;

                        return $translation;
                    }
                }
            }
            if ($this->isNew()) {
                $translation = new ValueI18n();
                $translation->setLocale($locale);
            } else {
                $translation = ValueI18nQuery::create()
                    ->filterByPrimaryKey(array($this->getPrimaryKey(), $locale))
                    ->findOneOrCreate($con);
                $this->currentTranslations[$locale] = $translation;
            }
            $this->addValueI18n($translation);
        }

        return $this->currentTranslations[$locale];
    }

    /**
     * Remove the translation for a given locale
     *
     * @param     string $locale Locale to use for the translation, e.g. 'fr_FR'
     * @param     PropelPDO $con an optional connection object
     *
     * @return    Value The current object (for fluent API support)
     */
    public function removeTranslation($locale = 'de', PropelPDO $con = null)
    {
        if (!$this->isNew()) {
            ValueI18nQuery::create()
                ->filterByPrimaryKey(array($this->getPrimaryKey(), $locale))
                ->delete($con);
        }
        if (isset($this->currentTranslations[$locale])) {
            unset($this->currentTranslations[$locale]);
        }
        foreach ($this->collValueI18ns as $key => $translation) {
            if ($translation->getLocale() == $locale) {
                unset($this->collValueI18ns[$key]);
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
     * @return ValueI18n */
    public function getCurrentTranslation(PropelPDO $con = null)
    {
        return $this->getTranslation($this->getLocale(), $con);
    }


        /**
         * Get the [text] column value.
         *
         * @return string
         */
        public function getText()
        {
        return $this->getCurrentTranslation()->getText();
    }


        /**
         * Set the value of [text] column.
         *
         * @param string $v new value
         * @return ValueI18n The current object (for fluent API support)
         */
        public function setText($v)
        {    $this->getCurrentTranslation()->setText($v);

        return $this;
    }

}
