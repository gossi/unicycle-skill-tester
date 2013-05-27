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
use gossi\skilltester\entities\ActionQuery;
use gossi\skilltester\entities\Feedback;
use gossi\skilltester\entities\FeedbackPeer;
use gossi\skilltester\entities\FeedbackQuery;
use gossi\skilltester\entities\Trick;
use gossi\skilltester\entities\TrickQuery;
use gossi\skilltester\entities\Value;
use gossi\skilltester\entities\ValueQuery;

/**
 * Base class that represents a row from the 'feedback' table.
 *
 *
 *
 * @package    propel.generator.gossi.skilltester.entities.om
 */
abstract class BaseFeedback extends BaseObject implements Persistent
{
    /**
     * Peer class name
     */
    const PEER = 'gossi\\skilltester\\entities\\FeedbackPeer';

    /**
     * The Peer class.
     * Instance provides a convenient way of calling static methods on a class
     * that calling code may not be able to identify.
     * @var        FeedbackPeer
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
     * The value for the trick_id field.
     * @var        int
     */
    protected $trick_id;

    /**
     * The value for the action_id field.
     * @var        int
     */
    protected $action_id;

    /**
     * The value for the percent field.
     * @var        int
     */
    protected $percent;

    /**
     * The value for the weight field.
     * @var        int
     */
    protected $weight;

    /**
     * The value for the max field.
     * @var        int
     */
    protected $max;

    /**
     * The value for the inverted field.
     * @var        boolean
     */
    protected $inverted;

    /**
     * The value for the mistake field.
     * @var        string
     */
    protected $mistake;

    /**
     * @var        Trick
     */
    protected $aTrick;

    /**
     * @var        Action
     */
    protected $aAction;

    /**
     * @var        PropelObjectCollection|Value[] Collection to store aggregation of Value objects.
     */
    protected $collValues;
    protected $collValuesPartial;

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

    /**
     * An array of objects scheduled for deletion.
     * @var		PropelObjectCollection
     */
    protected $valuesScheduledForDeletion = null;

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
     * Get the [trick_id] column value.
     *
     * @return int
     */
    public function getTrickId()
    {
        return $this->trick_id;
    }

    /**
     * Get the [action_id] column value.
     *
     * @return int
     */
    public function getActionId()
    {
        return $this->action_id;
    }

    /**
     * Get the [percent] column value.
     *
     * @return int
     */
    public function getPercent()
    {
        return $this->percent;
    }

    /**
     * Get the [weight] column value.
     *
     * @return int
     */
    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * Get the [max] column value.
     *
     * @return int
     */
    public function getMax()
    {
        return $this->max;
    }

    /**
     * Get the [inverted] column value.
     *
     * @return boolean
     */
    public function getInverted()
    {
        return $this->inverted;
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
     * @return Feedback The current object (for fluent API support)
     */
    public function setId($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->id !== $v) {
            $this->id = $v;
            $this->modifiedColumns[] = FeedbackPeer::ID;
        }


        return $this;
    } // setId()

    /**
     * Set the value of [trick_id] column.
     *
     * @param int $v new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setTrickId($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->trick_id !== $v) {
            $this->trick_id = $v;
            $this->modifiedColumns[] = FeedbackPeer::TRICK_ID;
        }

        if ($this->aTrick !== null && $this->aTrick->getId() !== $v) {
            $this->aTrick = null;
        }


        return $this;
    } // setTrickId()

    /**
     * Set the value of [action_id] column.
     *
     * @param int $v new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setActionId($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->action_id !== $v) {
            $this->action_id = $v;
            $this->modifiedColumns[] = FeedbackPeer::ACTION_ID;
        }

        if ($this->aAction !== null && $this->aAction->getId() !== $v) {
            $this->aAction = null;
        }


        return $this;
    } // setActionId()

    /**
     * Set the value of [percent] column.
     *
     * @param int $v new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setPercent($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->percent !== $v) {
            $this->percent = $v;
            $this->modifiedColumns[] = FeedbackPeer::PERCENT;
        }


        return $this;
    } // setPercent()

    /**
     * Set the value of [weight] column.
     *
     * @param int $v new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setWeight($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->weight !== $v) {
            $this->weight = $v;
            $this->modifiedColumns[] = FeedbackPeer::WEIGHT;
        }


        return $this;
    } // setWeight()

    /**
     * Set the value of [max] column.
     *
     * @param int $v new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setMax($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (int) $v;
        }

        if ($this->max !== $v) {
            $this->max = $v;
            $this->modifiedColumns[] = FeedbackPeer::MAX;
        }


        return $this;
    } // setMax()

    /**
     * Sets the value of the [inverted] column.
     * Non-boolean arguments are converted using the following rules:
     *   * 1, '1', 'true',  'on',  and 'yes' are converted to boolean true
     *   * 0, '0', 'false', 'off', and 'no'  are converted to boolean false
     * Check on string values is case insensitive (so 'FaLsE' is seen as 'false').
     *
     * @param boolean|integer|string $v The new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setInverted($v)
    {
        if ($v !== null) {
            if (is_string($v)) {
                $v = in_array(strtolower($v), array('false', 'off', '-', 'no', 'n', '0', '')) ? false : true;
            } else {
                $v = (boolean) $v;
            }
        }

        if ($this->inverted !== $v) {
            $this->inverted = $v;
            $this->modifiedColumns[] = FeedbackPeer::INVERTED;
        }


        return $this;
    } // setInverted()

    /**
     * Set the value of [mistake] column.
     *
     * @param string $v new value
     * @return Feedback The current object (for fluent API support)
     */
    public function setMistake($v)
    {
        if ($v !== null && is_numeric($v)) {
            $v = (string) $v;
        }

        if ($this->mistake !== $v) {
            $this->mistake = $v;
            $this->modifiedColumns[] = FeedbackPeer::MISTAKE;
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
            $this->trick_id = ($row[$startcol + 1] !== null) ? (int) $row[$startcol + 1] : null;
            $this->action_id = ($row[$startcol + 2] !== null) ? (int) $row[$startcol + 2] : null;
            $this->percent = ($row[$startcol + 3] !== null) ? (int) $row[$startcol + 3] : null;
            $this->weight = ($row[$startcol + 4] !== null) ? (int) $row[$startcol + 4] : null;
            $this->max = ($row[$startcol + 5] !== null) ? (int) $row[$startcol + 5] : null;
            $this->inverted = ($row[$startcol + 6] !== null) ? (boolean) $row[$startcol + 6] : null;
            $this->mistake = ($row[$startcol + 7] !== null) ? (string) $row[$startcol + 7] : null;
            $this->resetModified();

            $this->setNew(false);

            if ($rehydrate) {
                $this->ensureConsistency();
            }
            $this->postHydrate($row, $startcol, $rehydrate);
            return $startcol + 8; // 8 = FeedbackPeer::NUM_HYDRATE_COLUMNS.

        } catch (Exception $e) {
            throw new PropelException("Error populating Feedback object", $e);
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

        if ($this->aTrick !== null && $this->trick_id !== $this->aTrick->getId()) {
            $this->aTrick = null;
        }
        if ($this->aAction !== null && $this->action_id !== $this->aAction->getId()) {
            $this->aAction = null;
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
            $con = Propel::getConnection(FeedbackPeer::DATABASE_NAME, Propel::CONNECTION_READ);
        }

        // We don't need to alter the object instance pool; we're just modifying this instance
        // already in the pool.

        $stmt = FeedbackPeer::doSelectStmt($this->buildPkeyCriteria(), $con);
        $row = $stmt->fetch(PDO::FETCH_NUM);
        $stmt->closeCursor();
        if (!$row) {
            throw new PropelException('Cannot find matching row in the database to reload object values.');
        }
        $this->hydrate($row, 0, true); // rehydrate

        if ($deep) {  // also de-associate any related objects?

            $this->aTrick = null;
            $this->aAction = null;
            $this->collValues = null;

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
            $con = Propel::getConnection(FeedbackPeer::DATABASE_NAME, Propel::CONNECTION_WRITE);
        }

        $con->beginTransaction();
        try {
            $deleteQuery = FeedbackQuery::create()
                ->filterByPrimaryKey($this->getPrimaryKey());
            $ret = $this->preDelete($con);
            if ($ret) {
                $deleteQuery->delete($con);
                $this->postDelete($con);
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
            $con = Propel::getConnection(FeedbackPeer::DATABASE_NAME, Propel::CONNECTION_WRITE);
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
                FeedbackPeer::addInstanceToPool($this);
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

            if ($this->aTrick !== null) {
                if ($this->aTrick->isModified() || $this->aTrick->isNew()) {
                    $affectedRows += $this->aTrick->save($con);
                }
                $this->setTrick($this->aTrick);
            }

            if ($this->aAction !== null) {
                if ($this->aAction->isModified() || $this->aAction->isNew()) {
                    $affectedRows += $this->aAction->save($con);
                }
                $this->setAction($this->aAction);
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

            if ($this->valuesScheduledForDeletion !== null) {
                if (!$this->valuesScheduledForDeletion->isEmpty()) {
                    ValueQuery::create()
                        ->filterByPrimaryKeys($this->valuesScheduledForDeletion->getPrimaryKeys(false))
                        ->delete($con);
                    $this->valuesScheduledForDeletion = null;
                }
            }

            if ($this->collValues !== null) {
                foreach ($this->collValues as $referrerFK) {
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

        $this->modifiedColumns[] = FeedbackPeer::ID;
        if (null !== $this->id) {
            throw new PropelException('Cannot insert a value for auto-increment primary key (' . FeedbackPeer::ID . ')');
        }

         // check the columns in natural order for more readable SQL queries
        if ($this->isColumnModified(FeedbackPeer::ID)) {
            $modifiedColumns[':p' . $index++]  = '`id`';
        }
        if ($this->isColumnModified(FeedbackPeer::TRICK_ID)) {
            $modifiedColumns[':p' . $index++]  = '`trick_id`';
        }
        if ($this->isColumnModified(FeedbackPeer::ACTION_ID)) {
            $modifiedColumns[':p' . $index++]  = '`action_id`';
        }
        if ($this->isColumnModified(FeedbackPeer::PERCENT)) {
            $modifiedColumns[':p' . $index++]  = '`percent`';
        }
        if ($this->isColumnModified(FeedbackPeer::WEIGHT)) {
            $modifiedColumns[':p' . $index++]  = '`weight`';
        }
        if ($this->isColumnModified(FeedbackPeer::MAX)) {
            $modifiedColumns[':p' . $index++]  = '`max`';
        }
        if ($this->isColumnModified(FeedbackPeer::INVERTED)) {
            $modifiedColumns[':p' . $index++]  = '`inverted`';
        }
        if ($this->isColumnModified(FeedbackPeer::MISTAKE)) {
            $modifiedColumns[':p' . $index++]  = '`mistake`';
        }

        $sql = sprintf(
            'INSERT INTO `feedback` (%s) VALUES (%s)',
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
                    case '`trick_id`':
                        $stmt->bindValue($identifier, $this->trick_id, PDO::PARAM_INT);
                        break;
                    case '`action_id`':
                        $stmt->bindValue($identifier, $this->action_id, PDO::PARAM_INT);
                        break;
                    case '`percent`':
                        $stmt->bindValue($identifier, $this->percent, PDO::PARAM_INT);
                        break;
                    case '`weight`':
                        $stmt->bindValue($identifier, $this->weight, PDO::PARAM_INT);
                        break;
                    case '`max`':
                        $stmt->bindValue($identifier, $this->max, PDO::PARAM_INT);
                        break;
                    case '`inverted`':
                        $stmt->bindValue($identifier, (int) $this->inverted, PDO::PARAM_INT);
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

            if ($this->aTrick !== null) {
                if (!$this->aTrick->validate($columns)) {
                    $failureMap = array_merge($failureMap, $this->aTrick->getValidationFailures());
                }
            }

            if ($this->aAction !== null) {
                if (!$this->aAction->validate($columns)) {
                    $failureMap = array_merge($failureMap, $this->aAction->getValidationFailures());
                }
            }


            if (($retval = FeedbackPeer::doValidate($this, $columns)) !== true) {
                $failureMap = array_merge($failureMap, $retval);
            }


                if ($this->collValues !== null) {
                    foreach ($this->collValues as $referrerFK) {
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
        $pos = FeedbackPeer::translateFieldName($name, $type, BasePeer::TYPE_NUM);
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
                return $this->getTrickId();
                break;
            case 2:
                return $this->getActionId();
                break;
            case 3:
                return $this->getPercent();
                break;
            case 4:
                return $this->getWeight();
                break;
            case 5:
                return $this->getMax();
                break;
            case 6:
                return $this->getInverted();
                break;
            case 7:
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
        if (isset($alreadyDumpedObjects['Feedback'][$this->getPrimaryKey()])) {
            return '*RECURSION*';
        }
        $alreadyDumpedObjects['Feedback'][$this->getPrimaryKey()] = true;
        $keys = FeedbackPeer::getFieldNames($keyType);
        $result = array(
            $keys[0] => $this->getId(),
            $keys[1] => $this->getTrickId(),
            $keys[2] => $this->getActionId(),
            $keys[3] => $this->getPercent(),
            $keys[4] => $this->getWeight(),
            $keys[5] => $this->getMax(),
            $keys[6] => $this->getInverted(),
            $keys[7] => $this->getMistake(),
        );
        if ($includeForeignObjects) {
            if (null !== $this->aTrick) {
                $result['Trick'] = $this->aTrick->toArray($keyType, $includeLazyLoadColumns,  $alreadyDumpedObjects, true);
            }
            if (null !== $this->aAction) {
                $result['Action'] = $this->aAction->toArray($keyType, $includeLazyLoadColumns,  $alreadyDumpedObjects, true);
            }
            if (null !== $this->collValues) {
                $result['Values'] = $this->collValues->toArray(null, true, $keyType, $includeLazyLoadColumns, $alreadyDumpedObjects);
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
        $pos = FeedbackPeer::translateFieldName($name, $type, BasePeer::TYPE_NUM);

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
                $this->setTrickId($value);
                break;
            case 2:
                $this->setActionId($value);
                break;
            case 3:
                $this->setPercent($value);
                break;
            case 4:
                $this->setWeight($value);
                break;
            case 5:
                $this->setMax($value);
                break;
            case 6:
                $this->setInverted($value);
                break;
            case 7:
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
        $keys = FeedbackPeer::getFieldNames($keyType);

        if (array_key_exists($keys[0], $arr)) $this->setId($arr[$keys[0]]);
        if (array_key_exists($keys[1], $arr)) $this->setTrickId($arr[$keys[1]]);
        if (array_key_exists($keys[2], $arr)) $this->setActionId($arr[$keys[2]]);
        if (array_key_exists($keys[3], $arr)) $this->setPercent($arr[$keys[3]]);
        if (array_key_exists($keys[4], $arr)) $this->setWeight($arr[$keys[4]]);
        if (array_key_exists($keys[5], $arr)) $this->setMax($arr[$keys[5]]);
        if (array_key_exists($keys[6], $arr)) $this->setInverted($arr[$keys[6]]);
        if (array_key_exists($keys[7], $arr)) $this->setMistake($arr[$keys[7]]);
    }

    /**
     * Build a Criteria object containing the values of all modified columns in this object.
     *
     * @return Criteria The Criteria object containing all modified values.
     */
    public function buildCriteria()
    {
        $criteria = new Criteria(FeedbackPeer::DATABASE_NAME);

        if ($this->isColumnModified(FeedbackPeer::ID)) $criteria->add(FeedbackPeer::ID, $this->id);
        if ($this->isColumnModified(FeedbackPeer::TRICK_ID)) $criteria->add(FeedbackPeer::TRICK_ID, $this->trick_id);
        if ($this->isColumnModified(FeedbackPeer::ACTION_ID)) $criteria->add(FeedbackPeer::ACTION_ID, $this->action_id);
        if ($this->isColumnModified(FeedbackPeer::PERCENT)) $criteria->add(FeedbackPeer::PERCENT, $this->percent);
        if ($this->isColumnModified(FeedbackPeer::WEIGHT)) $criteria->add(FeedbackPeer::WEIGHT, $this->weight);
        if ($this->isColumnModified(FeedbackPeer::MAX)) $criteria->add(FeedbackPeer::MAX, $this->max);
        if ($this->isColumnModified(FeedbackPeer::INVERTED)) $criteria->add(FeedbackPeer::INVERTED, $this->inverted);
        if ($this->isColumnModified(FeedbackPeer::MISTAKE)) $criteria->add(FeedbackPeer::MISTAKE, $this->mistake);

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
        $criteria = new Criteria(FeedbackPeer::DATABASE_NAME);
        $criteria->add(FeedbackPeer::ID, $this->id);

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
     * @param object $copyObj An object of Feedback (or compatible) type.
     * @param boolean $deepCopy Whether to also copy all rows that refer (by fkey) to the current row.
     * @param boolean $makeNew Whether to reset autoincrement PKs and make the object new.
     * @throws PropelException
     */
    public function copyInto($copyObj, $deepCopy = false, $makeNew = true)
    {
        $copyObj->setTrickId($this->getTrickId());
        $copyObj->setActionId($this->getActionId());
        $copyObj->setPercent($this->getPercent());
        $copyObj->setWeight($this->getWeight());
        $copyObj->setMax($this->getMax());
        $copyObj->setInverted($this->getInverted());
        $copyObj->setMistake($this->getMistake());

        if ($deepCopy && !$this->startCopy) {
            // important: temporarily setNew(false) because this affects the behavior of
            // the getter/setter methods for fkey referrer objects.
            $copyObj->setNew(false);
            // store object hash to prevent cycle
            $this->startCopy = true;

            foreach ($this->getValues() as $relObj) {
                if ($relObj !== $this) {  // ensure that we don't try to copy a reference to ourselves
                    $copyObj->addValue($relObj->copy($deepCopy));
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
     * @return Feedback Clone of current object.
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
     * @return FeedbackPeer
     */
    public function getPeer()
    {
        if (self::$peer === null) {
            self::$peer = new FeedbackPeer();
        }

        return self::$peer;
    }

    /**
     * Declares an association between this object and a Trick object.
     *
     * @param             Trick $v
     * @return Feedback The current object (for fluent API support)
     * @throws PropelException
     */
    public function setTrick(Trick $v = null)
    {
        if ($v === null) {
            $this->setTrickId(NULL);
        } else {
            $this->setTrickId($v->getId());
        }

        $this->aTrick = $v;

        // Add binding for other direction of this n:n relationship.
        // If this object has already been added to the Trick object, it will not be re-added.
        if ($v !== null) {
            $v->addFeedback($this);
        }


        return $this;
    }


    /**
     * Get the associated Trick object
     *
     * @param PropelPDO $con Optional Connection object.
     * @param $doQuery Executes a query to get the object if required
     * @return Trick The associated Trick object.
     * @throws PropelException
     */
    public function getTrick(PropelPDO $con = null, $doQuery = true)
    {
        if ($this->aTrick === null && ($this->trick_id !== null) && $doQuery) {
            $this->aTrick = TrickQuery::create()->findPk($this->trick_id, $con);
            /* The following can be used additionally to
                guarantee the related object contains a reference
                to this object.  This level of coupling may, however, be
                undesirable since it could result in an only partially populated collection
                in the referenced object.
                $this->aTrick->addFeedbacks($this);
             */
        }

        return $this->aTrick;
    }

    /**
     * Declares an association between this object and a Action object.
     *
     * @param             Action $v
     * @return Feedback The current object (for fluent API support)
     * @throws PropelException
     */
    public function setAction(Action $v = null)
    {
        if ($v === null) {
            $this->setActionId(NULL);
        } else {
            $this->setActionId($v->getId());
        }

        $this->aAction = $v;

        // Add binding for other direction of this n:n relationship.
        // If this object has already been added to the Action object, it will not be re-added.
        if ($v !== null) {
            $v->addFeedback($this);
        }


        return $this;
    }


    /**
     * Get the associated Action object
     *
     * @param PropelPDO $con Optional Connection object.
     * @param $doQuery Executes a query to get the object if required
     * @return Action The associated Action object.
     * @throws PropelException
     */
    public function getAction(PropelPDO $con = null, $doQuery = true)
    {
        if ($this->aAction === null && ($this->action_id !== null) && $doQuery) {
            $this->aAction = ActionQuery::create()->findPk($this->action_id, $con);
            /* The following can be used additionally to
                guarantee the related object contains a reference
                to this object.  This level of coupling may, however, be
                undesirable since it could result in an only partially populated collection
                in the referenced object.
                $this->aAction->addFeedbacks($this);
             */
        }

        return $this->aAction;
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
        if ('Value' == $relationName) {
            $this->initValues();
        }
    }

    /**
     * Clears out the collValues collection
     *
     * This does not modify the database; however, it will remove any associated objects, causing
     * them to be refetched by subsequent calls to accessor method.
     *
     * @return Feedback The current object (for fluent API support)
     * @see        addValues()
     */
    public function clearValues()
    {
        $this->collValues = null; // important to set this to null since that means it is uninitialized
        $this->collValuesPartial = null;

        return $this;
    }

    /**
     * reset is the collValues collection loaded partially
     *
     * @return void
     */
    public function resetPartialValues($v = true)
    {
        $this->collValuesPartial = $v;
    }

    /**
     * Initializes the collValues collection.
     *
     * By default this just sets the collValues collection to an empty array (like clearcollValues());
     * however, you may wish to override this method in your stub class to provide setting appropriate
     * to your application -- for example, setting the initial array to the values stored in database.
     *
     * @param boolean $overrideExisting If set to true, the method call initializes
     *                                        the collection even if it is not empty
     *
     * @return void
     */
    public function initValues($overrideExisting = true)
    {
        if (null !== $this->collValues && !$overrideExisting) {
            return;
        }
        $this->collValues = new PropelObjectCollection();
        $this->collValues->setModel('Value');
    }

    /**
     * Gets an array of Value objects which contain a foreign key that references this object.
     *
     * If the $criteria is not null, it is used to always fetch the results from the database.
     * Otherwise the results are fetched from the database the first time, then cached.
     * Next time the same method is called without $criteria, the cached collection is returned.
     * If this Feedback is new, it will return
     * an empty collection or the current collection; the criteria is ignored on a new object.
     *
     * @param Criteria $criteria optional Criteria object to narrow the query
     * @param PropelPDO $con optional connection object
     * @return PropelObjectCollection|Value[] List of Value objects
     * @throws PropelException
     */
    public function getValues($criteria = null, PropelPDO $con = null)
    {
        $partial = $this->collValuesPartial && !$this->isNew();
        if (null === $this->collValues || null !== $criteria  || $partial) {
            if ($this->isNew() && null === $this->collValues) {
                // return empty collection
                $this->initValues();
            } else {
                $collValues = ValueQuery::create(null, $criteria)
                    ->filterByFeedback($this)
                    ->find($con);
                if (null !== $criteria) {
                    if (false !== $this->collValuesPartial && count($collValues)) {
                      $this->initValues(false);

                      foreach($collValues as $obj) {
                        if (false == $this->collValues->contains($obj)) {
                          $this->collValues->append($obj);
                        }
                      }

                      $this->collValuesPartial = true;
                    }

                    $collValues->getInternalIterator()->rewind();
                    return $collValues;
                }

                if($partial && $this->collValues) {
                    foreach($this->collValues as $obj) {
                        if($obj->isNew()) {
                            $collValues[] = $obj;
                        }
                    }
                }

                $this->collValues = $collValues;
                $this->collValuesPartial = false;
            }
        }

        return $this->collValues;
    }

    /**
     * Sets a collection of Value objects related by a one-to-many relationship
     * to the current object.
     * It will also schedule objects for deletion based on a diff between old objects (aka persisted)
     * and new objects from the given Propel collection.
     *
     * @param PropelCollection $values A Propel collection.
     * @param PropelPDO $con Optional connection object
     * @return Feedback The current object (for fluent API support)
     */
    public function setValues(PropelCollection $values, PropelPDO $con = null)
    {
        $valuesToDelete = $this->getValues(new Criteria(), $con)->diff($values);

        $this->valuesScheduledForDeletion = unserialize(serialize($valuesToDelete));

        foreach ($valuesToDelete as $valueRemoved) {
            $valueRemoved->setFeedback(null);
        }

        $this->collValues = null;
        foreach ($values as $value) {
            $this->addValue($value);
        }

        $this->collValues = $values;
        $this->collValuesPartial = false;

        return $this;
    }

    /**
     * Returns the number of related Value objects.
     *
     * @param Criteria $criteria
     * @param boolean $distinct
     * @param PropelPDO $con
     * @return int             Count of related Value objects.
     * @throws PropelException
     */
    public function countValues(Criteria $criteria = null, $distinct = false, PropelPDO $con = null)
    {
        $partial = $this->collValuesPartial && !$this->isNew();
        if (null === $this->collValues || null !== $criteria || $partial) {
            if ($this->isNew() && null === $this->collValues) {
                return 0;
            }

            if($partial && !$criteria) {
                return count($this->getValues());
            }
            $query = ValueQuery::create(null, $criteria);
            if ($distinct) {
                $query->distinct();
            }

            return $query
                ->filterByFeedback($this)
                ->count($con);
        }

        return count($this->collValues);
    }

    /**
     * Method called to associate a Value object to this object
     * through the Value foreign key attribute.
     *
     * @param    Value $l Value
     * @return Feedback The current object (for fluent API support)
     */
    public function addValue(Value $l)
    {
        if ($this->collValues === null) {
            $this->initValues();
            $this->collValuesPartial = true;
        }
        if (!in_array($l, $this->collValues->getArrayCopy(), true)) { // only add it if the **same** object is not already associated
            $this->doAddValue($l);
        }

        return $this;
    }

    /**
     * @param	Value $value The value object to add.
     */
    protected function doAddValue($value)
    {
        $this->collValues[]= $value;
        $value->setFeedback($this);
    }

    /**
     * @param	Value $value The value object to remove.
     * @return Feedback The current object (for fluent API support)
     */
    public function removeValue($value)
    {
        if ($this->getValues()->contains($value)) {
            $this->collValues->remove($this->collValues->search($value));
            if (null === $this->valuesScheduledForDeletion) {
                $this->valuesScheduledForDeletion = clone $this->collValues;
                $this->valuesScheduledForDeletion->clear();
            }
            $this->valuesScheduledForDeletion[]= clone $value;
            $value->setFeedback(null);
        }

        return $this;
    }

    /**
     * Clears the current object and sets all attributes to their default values
     */
    public function clear()
    {
        $this->id = null;
        $this->trick_id = null;
        $this->action_id = null;
        $this->percent = null;
        $this->weight = null;
        $this->max = null;
        $this->inverted = null;
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
            if ($this->collValues) {
                foreach ($this->collValues as $o) {
                    $o->clearAllReferences($deep);
                }
            }
            if ($this->aTrick instanceof Persistent) {
              $this->aTrick->clearAllReferences($deep);
            }
            if ($this->aAction instanceof Persistent) {
              $this->aAction->clearAllReferences($deep);
            }

            $this->alreadyInClearAllReferencesDeep = false;
        } // if ($deep)

        if ($this->collValues instanceof PropelCollection) {
            $this->collValues->clearIterator();
        }
        $this->collValues = null;
        $this->aTrick = null;
        $this->aAction = null;
    }

    /**
     * return the string representation of this object
     *
     * @return string
     */
    public function __toString()
    {
        return (string) $this->exportTo(FeedbackPeer::DEFAULT_STRING_FORMAT);
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

}
