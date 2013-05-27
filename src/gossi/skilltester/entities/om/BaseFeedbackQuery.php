<?php

namespace gossi\skilltester\entities\om;

use \Criteria;
use \Exception;
use \ModelCriteria;
use \ModelJoin;
use \PDO;
use \Propel;
use \PropelCollection;
use \PropelException;
use \PropelObjectCollection;
use \PropelPDO;
use gossi\skilltester\entities\Action;
use gossi\skilltester\entities\Feedback;
use gossi\skilltester\entities\FeedbackPeer;
use gossi\skilltester\entities\FeedbackQuery;
use gossi\skilltester\entities\Trick;
use gossi\skilltester\entities\Value;

/**
 * Base class that represents a query for the 'feedback' table.
 *
 *
 *
 * @method FeedbackQuery orderById($order = Criteria::ASC) Order by the id column
 * @method FeedbackQuery orderByTrickId($order = Criteria::ASC) Order by the trick_id column
 * @method FeedbackQuery orderByActionId($order = Criteria::ASC) Order by the action_id column
 * @method FeedbackQuery orderByPercent($order = Criteria::ASC) Order by the percent column
 * @method FeedbackQuery orderByWeight($order = Criteria::ASC) Order by the weight column
 * @method FeedbackQuery orderByMax($order = Criteria::ASC) Order by the max column
 * @method FeedbackQuery orderByInverted($order = Criteria::ASC) Order by the inverted column
 * @method FeedbackQuery orderByMistake($order = Criteria::ASC) Order by the mistake column
 *
 * @method FeedbackQuery groupById() Group by the id column
 * @method FeedbackQuery groupByTrickId() Group by the trick_id column
 * @method FeedbackQuery groupByActionId() Group by the action_id column
 * @method FeedbackQuery groupByPercent() Group by the percent column
 * @method FeedbackQuery groupByWeight() Group by the weight column
 * @method FeedbackQuery groupByMax() Group by the max column
 * @method FeedbackQuery groupByInverted() Group by the inverted column
 * @method FeedbackQuery groupByMistake() Group by the mistake column
 *
 * @method FeedbackQuery leftJoin($relation) Adds a LEFT JOIN clause to the query
 * @method FeedbackQuery rightJoin($relation) Adds a RIGHT JOIN clause to the query
 * @method FeedbackQuery innerJoin($relation) Adds a INNER JOIN clause to the query
 *
 * @method FeedbackQuery leftJoinTrick($relationAlias = null) Adds a LEFT JOIN clause to the query using the Trick relation
 * @method FeedbackQuery rightJoinTrick($relationAlias = null) Adds a RIGHT JOIN clause to the query using the Trick relation
 * @method FeedbackQuery innerJoinTrick($relationAlias = null) Adds a INNER JOIN clause to the query using the Trick relation
 *
 * @method FeedbackQuery leftJoinAction($relationAlias = null) Adds a LEFT JOIN clause to the query using the Action relation
 * @method FeedbackQuery rightJoinAction($relationAlias = null) Adds a RIGHT JOIN clause to the query using the Action relation
 * @method FeedbackQuery innerJoinAction($relationAlias = null) Adds a INNER JOIN clause to the query using the Action relation
 *
 * @method FeedbackQuery leftJoinValue($relationAlias = null) Adds a LEFT JOIN clause to the query using the Value relation
 * @method FeedbackQuery rightJoinValue($relationAlias = null) Adds a RIGHT JOIN clause to the query using the Value relation
 * @method FeedbackQuery innerJoinValue($relationAlias = null) Adds a INNER JOIN clause to the query using the Value relation
 *
 * @method Feedback findOne(PropelPDO $con = null) Return the first Feedback matching the query
 * @method Feedback findOneOrCreate(PropelPDO $con = null) Return the first Feedback matching the query, or a new Feedback object populated from the query conditions when no match is found
 *
 * @method Feedback findOneByTrickId(int $trick_id) Return the first Feedback filtered by the trick_id column
 * @method Feedback findOneByActionId(int $action_id) Return the first Feedback filtered by the action_id column
 * @method Feedback findOneByPercent(int $percent) Return the first Feedback filtered by the percent column
 * @method Feedback findOneByWeight(int $weight) Return the first Feedback filtered by the weight column
 * @method Feedback findOneByMax(int $max) Return the first Feedback filtered by the max column
 * @method Feedback findOneByInverted(boolean $inverted) Return the first Feedback filtered by the inverted column
 * @method Feedback findOneByMistake(string $mistake) Return the first Feedback filtered by the mistake column
 *
 * @method array findById(int $id) Return Feedback objects filtered by the id column
 * @method array findByTrickId(int $trick_id) Return Feedback objects filtered by the trick_id column
 * @method array findByActionId(int $action_id) Return Feedback objects filtered by the action_id column
 * @method array findByPercent(int $percent) Return Feedback objects filtered by the percent column
 * @method array findByWeight(int $weight) Return Feedback objects filtered by the weight column
 * @method array findByMax(int $max) Return Feedback objects filtered by the max column
 * @method array findByInverted(boolean $inverted) Return Feedback objects filtered by the inverted column
 * @method array findByMistake(string $mistake) Return Feedback objects filtered by the mistake column
 *
 * @package    propel.generator.gossi.skilltester.entities.om
 */
abstract class BaseFeedbackQuery extends ModelCriteria
{
    /**
     * Initializes internal state of BaseFeedbackQuery object.
     *
     * @param     string $dbName The dabase name
     * @param     string $modelName The phpName of a model, e.g. 'Book'
     * @param     string $modelAlias The alias for the model in this query, e.g. 'b'
     */
    public function __construct($dbName = 'skilltester', $modelName = 'gossi\\skilltester\\entities\\Feedback', $modelAlias = null)
    {
        parent::__construct($dbName, $modelName, $modelAlias);
    }

    /**
     * Returns a new FeedbackQuery object.
     *
     * @param     string $modelAlias The alias of a model in the query
     * @param   FeedbackQuery|Criteria $criteria Optional Criteria to build the query from
     *
     * @return FeedbackQuery
     */
    public static function create($modelAlias = null, $criteria = null)
    {
        if ($criteria instanceof FeedbackQuery) {
            return $criteria;
        }
        $query = new FeedbackQuery();
        if (null !== $modelAlias) {
            $query->setModelAlias($modelAlias);
        }
        if ($criteria instanceof Criteria) {
            $query->mergeWith($criteria);
        }

        return $query;
    }

    /**
     * Find object by primary key.
     * Propel uses the instance pool to skip the database if the object exists.
     * Go fast if the query is untouched.
     *
     * <code>
     * $obj  = $c->findPk(12, $con);
     * </code>
     *
     * @param mixed $key Primary key to use for the query
     * @param     PropelPDO $con an optional connection object
     *
     * @return   Feedback|Feedback[]|mixed the result, formatted by the current formatter
     */
    public function findPk($key, $con = null)
    {
        if ($key === null) {
            return null;
        }
        if ((null !== ($obj = FeedbackPeer::getInstanceFromPool((string) $key))) && !$this->formatter) {
            // the object is alredy in the instance pool
            return $obj;
        }
        if ($con === null) {
            $con = Propel::getConnection(FeedbackPeer::DATABASE_NAME, Propel::CONNECTION_READ);
        }
        $this->basePreSelect($con);
        if ($this->formatter || $this->modelAlias || $this->with || $this->select
         || $this->selectColumns || $this->asColumns || $this->selectModifiers
         || $this->map || $this->having || $this->joins) {
            return $this->findPkComplex($key, $con);
        } else {
            return $this->findPkSimple($key, $con);
        }
    }

    /**
     * Alias of findPk to use instance pooling
     *
     * @param     mixed $key Primary key to use for the query
     * @param     PropelPDO $con A connection object
     *
     * @return                 Feedback A model object, or null if the key is not found
     * @throws PropelException
     */
     public function findOneById($key, $con = null)
     {
        return $this->findPk($key, $con);
     }

    /**
     * Find object by primary key using raw SQL to go fast.
     * Bypass doSelect() and the object formatter by using generated code.
     *
     * @param     mixed $key Primary key to use for the query
     * @param     PropelPDO $con A connection object
     *
     * @return                 Feedback A model object, or null if the key is not found
     * @throws PropelException
     */
    protected function findPkSimple($key, $con)
    {
        $sql = 'SELECT `id`, `trick_id`, `action_id`, `percent`, `weight`, `max`, `inverted`, `mistake` FROM `feedback` WHERE `id` = :p0';
        try {
            $stmt = $con->prepare($sql);
            $stmt->bindValue(':p0', $key, PDO::PARAM_INT);
            $stmt->execute();
        } catch (Exception $e) {
            Propel::log($e->getMessage(), Propel::LOG_ERR);
            throw new PropelException(sprintf('Unable to execute SELECT statement [%s]', $sql), $e);
        }
        $obj = null;
        if ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $obj = new Feedback();
            $obj->hydrate($row);
            FeedbackPeer::addInstanceToPool($obj, (string) $key);
        }
        $stmt->closeCursor();

        return $obj;
    }

    /**
     * Find object by primary key.
     *
     * @param     mixed $key Primary key to use for the query
     * @param     PropelPDO $con A connection object
     *
     * @return Feedback|Feedback[]|mixed the result, formatted by the current formatter
     */
    protected function findPkComplex($key, $con)
    {
        // As the query uses a PK condition, no limit(1) is necessary.
        $criteria = $this->isKeepQuery() ? clone $this : $this;
        $stmt = $criteria
            ->filterByPrimaryKey($key)
            ->doSelect($con);

        return $criteria->getFormatter()->init($criteria)->formatOne($stmt);
    }

    /**
     * Find objects by primary key
     * <code>
     * $objs = $c->findPks(array(12, 56, 832), $con);
     * </code>
     * @param     array $keys Primary keys to use for the query
     * @param     PropelPDO $con an optional connection object
     *
     * @return PropelObjectCollection|Feedback[]|mixed the list of results, formatted by the current formatter
     */
    public function findPks($keys, $con = null)
    {
        if ($con === null) {
            $con = Propel::getConnection($this->getDbName(), Propel::CONNECTION_READ);
        }
        $this->basePreSelect($con);
        $criteria = $this->isKeepQuery() ? clone $this : $this;
        $stmt = $criteria
            ->filterByPrimaryKeys($keys)
            ->doSelect($con);

        return $criteria->getFormatter()->init($criteria)->format($stmt);
    }

    /**
     * Filter the query by primary key
     *
     * @param     mixed $key Primary key to use for the query
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByPrimaryKey($key)
    {

        return $this->addUsingAlias(FeedbackPeer::ID, $key, Criteria::EQUAL);
    }

    /**
     * Filter the query by a list of primary keys
     *
     * @param     array $keys The list of primary key to use for the query
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByPrimaryKeys($keys)
    {

        return $this->addUsingAlias(FeedbackPeer::ID, $keys, Criteria::IN);
    }

    /**
     * Filter the query on the id column
     *
     * Example usage:
     * <code>
     * $query->filterById(1234); // WHERE id = 1234
     * $query->filterById(array(12, 34)); // WHERE id IN (12, 34)
     * $query->filterById(array('min' => 12)); // WHERE id >= 12
     * $query->filterById(array('max' => 12)); // WHERE id <= 12
     * </code>
     *
     * @param     mixed $id The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterById($id = null, $comparison = null)
    {
        if (is_array($id)) {
            $useMinMax = false;
            if (isset($id['min'])) {
                $this->addUsingAlias(FeedbackPeer::ID, $id['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($id['max'])) {
                $this->addUsingAlias(FeedbackPeer::ID, $id['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::ID, $id, $comparison);
    }

    /**
     * Filter the query on the trick_id column
     *
     * Example usage:
     * <code>
     * $query->filterByTrickId(1234); // WHERE trick_id = 1234
     * $query->filterByTrickId(array(12, 34)); // WHERE trick_id IN (12, 34)
     * $query->filterByTrickId(array('min' => 12)); // WHERE trick_id >= 12
     * $query->filterByTrickId(array('max' => 12)); // WHERE trick_id <= 12
     * </code>
     *
     * @see       filterByTrick()
     *
     * @param     mixed $trickId The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByTrickId($trickId = null, $comparison = null)
    {
        if (is_array($trickId)) {
            $useMinMax = false;
            if (isset($trickId['min'])) {
                $this->addUsingAlias(FeedbackPeer::TRICK_ID, $trickId['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($trickId['max'])) {
                $this->addUsingAlias(FeedbackPeer::TRICK_ID, $trickId['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::TRICK_ID, $trickId, $comparison);
    }

    /**
     * Filter the query on the action_id column
     *
     * Example usage:
     * <code>
     * $query->filterByActionId(1234); // WHERE action_id = 1234
     * $query->filterByActionId(array(12, 34)); // WHERE action_id IN (12, 34)
     * $query->filterByActionId(array('min' => 12)); // WHERE action_id >= 12
     * $query->filterByActionId(array('max' => 12)); // WHERE action_id <= 12
     * </code>
     *
     * @see       filterByAction()
     *
     * @param     mixed $actionId The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByActionId($actionId = null, $comparison = null)
    {
        if (is_array($actionId)) {
            $useMinMax = false;
            if (isset($actionId['min'])) {
                $this->addUsingAlias(FeedbackPeer::ACTION_ID, $actionId['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($actionId['max'])) {
                $this->addUsingAlias(FeedbackPeer::ACTION_ID, $actionId['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::ACTION_ID, $actionId, $comparison);
    }

    /**
     * Filter the query on the percent column
     *
     * Example usage:
     * <code>
     * $query->filterByPercent(1234); // WHERE percent = 1234
     * $query->filterByPercent(array(12, 34)); // WHERE percent IN (12, 34)
     * $query->filterByPercent(array('min' => 12)); // WHERE percent >= 12
     * $query->filterByPercent(array('max' => 12)); // WHERE percent <= 12
     * </code>
     *
     * @param     mixed $percent The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByPercent($percent = null, $comparison = null)
    {
        if (is_array($percent)) {
            $useMinMax = false;
            if (isset($percent['min'])) {
                $this->addUsingAlias(FeedbackPeer::PERCENT, $percent['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($percent['max'])) {
                $this->addUsingAlias(FeedbackPeer::PERCENT, $percent['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::PERCENT, $percent, $comparison);
    }

    /**
     * Filter the query on the weight column
     *
     * Example usage:
     * <code>
     * $query->filterByWeight(1234); // WHERE weight = 1234
     * $query->filterByWeight(array(12, 34)); // WHERE weight IN (12, 34)
     * $query->filterByWeight(array('min' => 12)); // WHERE weight >= 12
     * $query->filterByWeight(array('max' => 12)); // WHERE weight <= 12
     * </code>
     *
     * @param     mixed $weight The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByWeight($weight = null, $comparison = null)
    {
        if (is_array($weight)) {
            $useMinMax = false;
            if (isset($weight['min'])) {
                $this->addUsingAlias(FeedbackPeer::WEIGHT, $weight['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($weight['max'])) {
                $this->addUsingAlias(FeedbackPeer::WEIGHT, $weight['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::WEIGHT, $weight, $comparison);
    }

    /**
     * Filter the query on the max column
     *
     * Example usage:
     * <code>
     * $query->filterByMax(1234); // WHERE max = 1234
     * $query->filterByMax(array(12, 34)); // WHERE max IN (12, 34)
     * $query->filterByMax(array('min' => 12)); // WHERE max >= 12
     * $query->filterByMax(array('max' => 12)); // WHERE max <= 12
     * </code>
     *
     * @param     mixed $max The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByMax($max = null, $comparison = null)
    {
        if (is_array($max)) {
            $useMinMax = false;
            if (isset($max['min'])) {
                $this->addUsingAlias(FeedbackPeer::MAX, $max['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($max['max'])) {
                $this->addUsingAlias(FeedbackPeer::MAX, $max['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::MAX, $max, $comparison);
    }

    /**
     * Filter the query on the inverted column
     *
     * Example usage:
     * <code>
     * $query->filterByInverted(true); // WHERE inverted = true
     * $query->filterByInverted('yes'); // WHERE inverted = true
     * </code>
     *
     * @param     boolean|string $inverted The value to use as filter.
     *              Non-boolean arguments are converted using the following rules:
     *                * 1, '1', 'true',  'on',  and 'yes' are converted to boolean true
     *                * 0, '0', 'false', 'off', and 'no'  are converted to boolean false
     *              Check on string values is case insensitive (so 'FaLsE' is seen as 'false').
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByInverted($inverted = null, $comparison = null)
    {
        if (is_string($inverted)) {
            $inverted = in_array(strtolower($inverted), array('false', 'off', '-', 'no', 'n', '0', '')) ? false : true;
        }

        return $this->addUsingAlias(FeedbackPeer::INVERTED, $inverted, $comparison);
    }

    /**
     * Filter the query on the mistake column
     *
     * Example usage:
     * <code>
     * $query->filterByMistake('fooValue');   // WHERE mistake = 'fooValue'
     * $query->filterByMistake('%fooValue%'); // WHERE mistake LIKE '%fooValue%'
     * </code>
     *
     * @param     string $mistake The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function filterByMistake($mistake = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($mistake)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $mistake)) {
                $mistake = str_replace('*', '%', $mistake);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(FeedbackPeer::MISTAKE, $mistake, $comparison);
    }

    /**
     * Filter the query by a related Trick object
     *
     * @param   Trick|PropelObjectCollection $trick The related object(s) to use as filter
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return                 FeedbackQuery The current query, for fluid interface
     * @throws PropelException - if the provided filter is invalid.
     */
    public function filterByTrick($trick, $comparison = null)
    {
        if ($trick instanceof Trick) {
            return $this
                ->addUsingAlias(FeedbackPeer::TRICK_ID, $trick->getId(), $comparison);
        } elseif ($trick instanceof PropelObjectCollection) {
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }

            return $this
                ->addUsingAlias(FeedbackPeer::TRICK_ID, $trick->toKeyValue('PrimaryKey', 'Id'), $comparison);
        } else {
            throw new PropelException('filterByTrick() only accepts arguments of type Trick or PropelCollection');
        }
    }

    /**
     * Adds a JOIN clause to the query using the Trick relation
     *
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function joinTrick($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        $tableMap = $this->getTableMap();
        $relationMap = $tableMap->getRelation('Trick');

        // create a ModelJoin object for this join
        $join = new ModelJoin();
        $join->setJoinType($joinType);
        $join->setRelationMap($relationMap, $this->useAliasInSQL ? $this->getModelAlias() : null, $relationAlias);
        if ($previousJoin = $this->getPreviousJoin()) {
            $join->setPreviousJoin($previousJoin);
        }

        // add the ModelJoin to the current object
        if ($relationAlias) {
            $this->addAlias($relationAlias, $relationMap->getRightTable()->getName());
            $this->addJoinObject($join, $relationAlias);
        } else {
            $this->addJoinObject($join, 'Trick');
        }

        return $this;
    }

    /**
     * Use the Trick relation Trick object
     *
     * @see       useQuery()
     *
     * @param     string $relationAlias optional alias for the relation,
     *                                   to be used as main alias in the secondary query
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return   \gossi\skilltester\entities\TrickQuery A secondary query class using the current class as primary query
     */
    public function useTrickQuery($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        return $this
            ->joinTrick($relationAlias, $joinType)
            ->useQuery($relationAlias ? $relationAlias : 'Trick', '\gossi\skilltester\entities\TrickQuery');
    }

    /**
     * Filter the query by a related Action object
     *
     * @param   Action|PropelObjectCollection $action The related object(s) to use as filter
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return                 FeedbackQuery The current query, for fluid interface
     * @throws PropelException - if the provided filter is invalid.
     */
    public function filterByAction($action, $comparison = null)
    {
        if ($action instanceof Action) {
            return $this
                ->addUsingAlias(FeedbackPeer::ACTION_ID, $action->getId(), $comparison);
        } elseif ($action instanceof PropelObjectCollection) {
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }

            return $this
                ->addUsingAlias(FeedbackPeer::ACTION_ID, $action->toKeyValue('PrimaryKey', 'Id'), $comparison);
        } else {
            throw new PropelException('filterByAction() only accepts arguments of type Action or PropelCollection');
        }
    }

    /**
     * Adds a JOIN clause to the query using the Action relation
     *
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function joinAction($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        $tableMap = $this->getTableMap();
        $relationMap = $tableMap->getRelation('Action');

        // create a ModelJoin object for this join
        $join = new ModelJoin();
        $join->setJoinType($joinType);
        $join->setRelationMap($relationMap, $this->useAliasInSQL ? $this->getModelAlias() : null, $relationAlias);
        if ($previousJoin = $this->getPreviousJoin()) {
            $join->setPreviousJoin($previousJoin);
        }

        // add the ModelJoin to the current object
        if ($relationAlias) {
            $this->addAlias($relationAlias, $relationMap->getRightTable()->getName());
            $this->addJoinObject($join, $relationAlias);
        } else {
            $this->addJoinObject($join, 'Action');
        }

        return $this;
    }

    /**
     * Use the Action relation Action object
     *
     * @see       useQuery()
     *
     * @param     string $relationAlias optional alias for the relation,
     *                                   to be used as main alias in the secondary query
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return   \gossi\skilltester\entities\ActionQuery A secondary query class using the current class as primary query
     */
    public function useActionQuery($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        return $this
            ->joinAction($relationAlias, $joinType)
            ->useQuery($relationAlias ? $relationAlias : 'Action', '\gossi\skilltester\entities\ActionQuery');
    }

    /**
     * Filter the query by a related Value object
     *
     * @param   Value|PropelObjectCollection $value  the related object to use as filter
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return                 FeedbackQuery The current query, for fluid interface
     * @throws PropelException - if the provided filter is invalid.
     */
    public function filterByValue($value, $comparison = null)
    {
        if ($value instanceof Value) {
            return $this
                ->addUsingAlias(FeedbackPeer::ID, $value->getFeedbackId(), $comparison);
        } elseif ($value instanceof PropelObjectCollection) {
            return $this
                ->useValueQuery()
                ->filterByPrimaryKeys($value->getPrimaryKeys())
                ->endUse();
        } else {
            throw new PropelException('filterByValue() only accepts arguments of type Value or PropelCollection');
        }
    }

    /**
     * Adds a JOIN clause to the query using the Value relation
     *
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function joinValue($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        $tableMap = $this->getTableMap();
        $relationMap = $tableMap->getRelation('Value');

        // create a ModelJoin object for this join
        $join = new ModelJoin();
        $join->setJoinType($joinType);
        $join->setRelationMap($relationMap, $this->useAliasInSQL ? $this->getModelAlias() : null, $relationAlias);
        if ($previousJoin = $this->getPreviousJoin()) {
            $join->setPreviousJoin($previousJoin);
        }

        // add the ModelJoin to the current object
        if ($relationAlias) {
            $this->addAlias($relationAlias, $relationMap->getRightTable()->getName());
            $this->addJoinObject($join, $relationAlias);
        } else {
            $this->addJoinObject($join, 'Value');
        }

        return $this;
    }

    /**
     * Use the Value relation Value object
     *
     * @see       useQuery()
     *
     * @param     string $relationAlias optional alias for the relation,
     *                                   to be used as main alias in the secondary query
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return   \gossi\skilltester\entities\ValueQuery A secondary query class using the current class as primary query
     */
    public function useValueQuery($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        return $this
            ->joinValue($relationAlias, $joinType)
            ->useQuery($relationAlias ? $relationAlias : 'Value', '\gossi\skilltester\entities\ValueQuery');
    }

    /**
     * Exclude object from result
     *
     * @param   Feedback $feedback Object to remove from the list of results
     *
     * @return FeedbackQuery The current query, for fluid interface
     */
    public function prune($feedback = null)
    {
        if ($feedback) {
            $this->addUsingAlias(FeedbackPeer::ID, $feedback->getId(), Criteria::NOT_EQUAL);
        }

        return $this;
    }

}
