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
use gossi\skilltester\entities\Feedback;
use gossi\skilltester\entities\Value;
use gossi\skilltester\entities\ValueI18n;
use gossi\skilltester\entities\ValuePeer;
use gossi\skilltester\entities\ValueQuery;

/**
 * Base class that represents a query for the 'value' table.
 *
 *
 *
 * @method ValueQuery orderById($order = Criteria::ASC) Order by the id column
 * @method ValueQuery orderByFeedbackId($order = Criteria::ASC) Order by the feedback_id column
 * @method ValueQuery orderByValue($order = Criteria::ASC) Order by the value column
 * @method ValueQuery orderByRange($order = Criteria::ASC) Order by the range column
 * @method ValueQuery orderByMistake($order = Criteria::ASC) Order by the mistake column
 *
 * @method ValueQuery groupById() Group by the id column
 * @method ValueQuery groupByFeedbackId() Group by the feedback_id column
 * @method ValueQuery groupByValue() Group by the value column
 * @method ValueQuery groupByRange() Group by the range column
 * @method ValueQuery groupByMistake() Group by the mistake column
 *
 * @method ValueQuery leftJoin($relation) Adds a LEFT JOIN clause to the query
 * @method ValueQuery rightJoin($relation) Adds a RIGHT JOIN clause to the query
 * @method ValueQuery innerJoin($relation) Adds a INNER JOIN clause to the query
 *
 * @method ValueQuery leftJoinFeedback($relationAlias = null) Adds a LEFT JOIN clause to the query using the Feedback relation
 * @method ValueQuery rightJoinFeedback($relationAlias = null) Adds a RIGHT JOIN clause to the query using the Feedback relation
 * @method ValueQuery innerJoinFeedback($relationAlias = null) Adds a INNER JOIN clause to the query using the Feedback relation
 *
 * @method ValueQuery leftJoinValueI18n($relationAlias = null) Adds a LEFT JOIN clause to the query using the ValueI18n relation
 * @method ValueQuery rightJoinValueI18n($relationAlias = null) Adds a RIGHT JOIN clause to the query using the ValueI18n relation
 * @method ValueQuery innerJoinValueI18n($relationAlias = null) Adds a INNER JOIN clause to the query using the ValueI18n relation
 *
 * @method Value findOne(PropelPDO $con = null) Return the first Value matching the query
 * @method Value findOneOrCreate(PropelPDO $con = null) Return the first Value matching the query, or a new Value object populated from the query conditions when no match is found
 *
 * @method Value findOneByFeedbackId(int $feedback_id) Return the first Value filtered by the feedback_id column
 * @method Value findOneByValue(string $value) Return the first Value filtered by the value column
 * @method Value findOneByRange(string $range) Return the first Value filtered by the range column
 * @method Value findOneByMistake(string $mistake) Return the first Value filtered by the mistake column
 *
 * @method array findById(int $id) Return Value objects filtered by the id column
 * @method array findByFeedbackId(int $feedback_id) Return Value objects filtered by the feedback_id column
 * @method array findByValue(string $value) Return Value objects filtered by the value column
 * @method array findByRange(string $range) Return Value objects filtered by the range column
 * @method array findByMistake(string $mistake) Return Value objects filtered by the mistake column
 *
 * @package    propel.generator.gossi.skilltester.entities.om
 */
abstract class BaseValueQuery extends ModelCriteria
{
    /**
     * Initializes internal state of BaseValueQuery object.
     *
     * @param     string $dbName The dabase name
     * @param     string $modelName The phpName of a model, e.g. 'Book'
     * @param     string $modelAlias The alias for the model in this query, e.g. 'b'
     */
    public function __construct($dbName = 'skilltester', $modelName = 'gossi\\skilltester\\entities\\Value', $modelAlias = null)
    {
        parent::__construct($dbName, $modelName, $modelAlias);
    }

    /**
     * Returns a new ValueQuery object.
     *
     * @param     string $modelAlias The alias of a model in the query
     * @param   ValueQuery|Criteria $criteria Optional Criteria to build the query from
     *
     * @return ValueQuery
     */
    public static function create($modelAlias = null, $criteria = null)
    {
        if ($criteria instanceof ValueQuery) {
            return $criteria;
        }
        $query = new ValueQuery();
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
     * @return   Value|Value[]|mixed the result, formatted by the current formatter
     */
    public function findPk($key, $con = null)
    {
        if ($key === null) {
            return null;
        }
        if ((null !== ($obj = ValuePeer::getInstanceFromPool((string) $key))) && !$this->formatter) {
            // the object is alredy in the instance pool
            return $obj;
        }
        if ($con === null) {
            $con = Propel::getConnection(ValuePeer::DATABASE_NAME, Propel::CONNECTION_READ);
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
     * @return                 Value A model object, or null if the key is not found
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
     * @return                 Value A model object, or null if the key is not found
     * @throws PropelException
     */
    protected function findPkSimple($key, $con)
    {
        $sql = 'SELECT `id`, `feedback_id`, `value`, `range`, `mistake` FROM `value` WHERE `id` = :p0';
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
            $obj = new Value();
            $obj->hydrate($row);
            ValuePeer::addInstanceToPool($obj, (string) $key);
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
     * @return Value|Value[]|mixed the result, formatted by the current formatter
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
     * @return PropelObjectCollection|Value[]|mixed the list of results, formatted by the current formatter
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
     * @return ValueQuery The current query, for fluid interface
     */
    public function filterByPrimaryKey($key)
    {

        return $this->addUsingAlias(ValuePeer::ID, $key, Criteria::EQUAL);
    }

    /**
     * Filter the query by a list of primary keys
     *
     * @param     array $keys The list of primary key to use for the query
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function filterByPrimaryKeys($keys)
    {

        return $this->addUsingAlias(ValuePeer::ID, $keys, Criteria::IN);
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
     * @return ValueQuery The current query, for fluid interface
     */
    public function filterById($id = null, $comparison = null)
    {
        if (is_array($id)) {
            $useMinMax = false;
            if (isset($id['min'])) {
                $this->addUsingAlias(ValuePeer::ID, $id['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($id['max'])) {
                $this->addUsingAlias(ValuePeer::ID, $id['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(ValuePeer::ID, $id, $comparison);
    }

    /**
     * Filter the query on the feedback_id column
     *
     * Example usage:
     * <code>
     * $query->filterByFeedbackId(1234); // WHERE feedback_id = 1234
     * $query->filterByFeedbackId(array(12, 34)); // WHERE feedback_id IN (12, 34)
     * $query->filterByFeedbackId(array('min' => 12)); // WHERE feedback_id >= 12
     * $query->filterByFeedbackId(array('max' => 12)); // WHERE feedback_id <= 12
     * </code>
     *
     * @see       filterByFeedback()
     *
     * @param     mixed $feedbackId The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function filterByFeedbackId($feedbackId = null, $comparison = null)
    {
        if (is_array($feedbackId)) {
            $useMinMax = false;
            if (isset($feedbackId['min'])) {
                $this->addUsingAlias(ValuePeer::FEEDBACK_ID, $feedbackId['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($feedbackId['max'])) {
                $this->addUsingAlias(ValuePeer::FEEDBACK_ID, $feedbackId['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(ValuePeer::FEEDBACK_ID, $feedbackId, $comparison);
    }

    /**
     * Filter the query on the value column
     *
     * Example usage:
     * <code>
     * $query->filterByValue('fooValue');   // WHERE value = 'fooValue'
     * $query->filterByValue('%fooValue%'); // WHERE value LIKE '%fooValue%'
     * </code>
     *
     * @param     string $value The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function filterByValue($value = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($value)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $value)) {
                $value = str_replace('*', '%', $value);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(ValuePeer::VALUE, $value, $comparison);
    }

    /**
     * Filter the query on the range column
     *
     * Example usage:
     * <code>
     * $query->filterByRange('fooValue');   // WHERE range = 'fooValue'
     * $query->filterByRange('%fooValue%'); // WHERE range LIKE '%fooValue%'
     * </code>
     *
     * @param     string $range The value to use as filter.
     *              Accepts wildcards (* and % trigger a LIKE)
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function filterByRange($range = null, $comparison = null)
    {
        if (null === $comparison) {
            if (is_array($range)) {
                $comparison = Criteria::IN;
            } elseif (preg_match('/[\%\*]/', $range)) {
                $range = str_replace('*', '%', $range);
                $comparison = Criteria::LIKE;
            }
        }

        return $this->addUsingAlias(ValuePeer::RANGE, $range, $comparison);
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
     * @return ValueQuery The current query, for fluid interface
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

        return $this->addUsingAlias(ValuePeer::MISTAKE, $mistake, $comparison);
    }

    /**
     * Filter the query by a related Feedback object
     *
     * @param   Feedback|PropelObjectCollection $feedback The related object(s) to use as filter
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return                 ValueQuery The current query, for fluid interface
     * @throws PropelException - if the provided filter is invalid.
     */
    public function filterByFeedback($feedback, $comparison = null)
    {
        if ($feedback instanceof Feedback) {
            return $this
                ->addUsingAlias(ValuePeer::FEEDBACK_ID, $feedback->getId(), $comparison);
        } elseif ($feedback instanceof PropelObjectCollection) {
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }

            return $this
                ->addUsingAlias(ValuePeer::FEEDBACK_ID, $feedback->toKeyValue('PrimaryKey', 'Id'), $comparison);
        } else {
            throw new PropelException('filterByFeedback() only accepts arguments of type Feedback or PropelCollection');
        }
    }

    /**
     * Adds a JOIN clause to the query using the Feedback relation
     *
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function joinFeedback($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        $tableMap = $this->getTableMap();
        $relationMap = $tableMap->getRelation('Feedback');

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
            $this->addJoinObject($join, 'Feedback');
        }

        return $this;
    }

    /**
     * Use the Feedback relation Feedback object
     *
     * @see       useQuery()
     *
     * @param     string $relationAlias optional alias for the relation,
     *                                   to be used as main alias in the secondary query
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return   \gossi\skilltester\entities\FeedbackQuery A secondary query class using the current class as primary query
     */
    public function useFeedbackQuery($relationAlias = null, $joinType = Criteria::INNER_JOIN)
    {
        return $this
            ->joinFeedback($relationAlias, $joinType)
            ->useQuery($relationAlias ? $relationAlias : 'Feedback', '\gossi\skilltester\entities\FeedbackQuery');
    }

    /**
     * Filter the query by a related ValueI18n object
     *
     * @param   ValueI18n|PropelObjectCollection $valueI18n  the related object to use as filter
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return                 ValueQuery The current query, for fluid interface
     * @throws PropelException - if the provided filter is invalid.
     */
    public function filterByValueI18n($valueI18n, $comparison = null)
    {
        if ($valueI18n instanceof ValueI18n) {
            return $this
                ->addUsingAlias(ValuePeer::ID, $valueI18n->getId(), $comparison);
        } elseif ($valueI18n instanceof PropelObjectCollection) {
            return $this
                ->useValueI18nQuery()
                ->filterByPrimaryKeys($valueI18n->getPrimaryKeys())
                ->endUse();
        } else {
            throw new PropelException('filterByValueI18n() only accepts arguments of type ValueI18n or PropelCollection');
        }
    }

    /**
     * Adds a JOIN clause to the query using the ValueI18n relation
     *
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function joinValueI18n($relationAlias = null, $joinType = 'LEFT JOIN')
    {
        $tableMap = $this->getTableMap();
        $relationMap = $tableMap->getRelation('ValueI18n');

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
            $this->addJoinObject($join, 'ValueI18n');
        }

        return $this;
    }

    /**
     * Use the ValueI18n relation ValueI18n object
     *
     * @see       useQuery()
     *
     * @param     string $relationAlias optional alias for the relation,
     *                                   to be used as main alias in the secondary query
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return   \gossi\skilltester\entities\ValueI18nQuery A secondary query class using the current class as primary query
     */
    public function useValueI18nQuery($relationAlias = null, $joinType = 'LEFT JOIN')
    {
        return $this
            ->joinValueI18n($relationAlias, $joinType)
            ->useQuery($relationAlias ? $relationAlias : 'ValueI18n', '\gossi\skilltester\entities\ValueI18nQuery');
    }

    /**
     * Exclude object from result
     *
     * @param   Value $value Object to remove from the list of results
     *
     * @return ValueQuery The current query, for fluid interface
     */
    public function prune($value = null)
    {
        if ($value) {
            $this->addUsingAlias(ValuePeer::ID, $value->getId(), Criteria::NOT_EQUAL);
        }

        return $this;
    }

    // i18n behavior

    /**
     * Adds a JOIN clause to the query using the i18n relation
     *
     * @param     string $locale Locale to use for the join condition, e.g. 'fr_FR'
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'. Defaults to left join.
     *
     * @return    ValueQuery The current query, for fluid interface
     */
    public function joinI18n($locale = 'de', $relationAlias = null, $joinType = Criteria::LEFT_JOIN)
    {
        $relationName = $relationAlias ? $relationAlias : 'ValueI18n';

        return $this
            ->joinValueI18n($relationAlias, $joinType)
            ->addJoinCondition($relationName, $relationName . '.Locale = ?', $locale);
    }

    /**
     * Adds a JOIN clause to the query and hydrates the related I18n object.
     * Shortcut for $c->joinI18n($locale)->with()
     *
     * @param     string $locale Locale to use for the join condition, e.g. 'fr_FR'
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'. Defaults to left join.
     *
     * @return    ValueQuery The current query, for fluid interface
     */
    public function joinWithI18n($locale = 'de', $joinType = Criteria::LEFT_JOIN)
    {
        $this
            ->joinI18n($locale, null, $joinType)
            ->with('ValueI18n');
        $this->with['ValueI18n']->setIsWithOneToMany(false);

        return $this;
    }

    /**
     * Use the I18n relation query object
     *
     * @see       useQuery()
     *
     * @param     string $locale Locale to use for the join condition, e.g. 'fr_FR'
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'. Defaults to left join.
     *
     * @return    ValueI18nQuery A secondary query class using the current class as primary query
     */
    public function useI18nQuery($locale = 'de', $relationAlias = null, $joinType = Criteria::LEFT_JOIN)
    {
        return $this
            ->joinI18n($locale, $relationAlias, $joinType)
            ->useQuery($relationAlias ? $relationAlias : 'ValueI18n', 'gossi\skilltester\entities\ValueI18nQuery');
    }

}
