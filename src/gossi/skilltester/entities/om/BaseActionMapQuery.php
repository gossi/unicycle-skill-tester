<?php

namespace gossi\skilltester\entities\om;

use \Criteria;
use \Exception;
use \ModelCriteria;
use \ModelJoin;
use \PDO;
use \Propel;
use \PropelException;
use \PropelObjectCollection;
use \PropelPDO;
use gossi\skilltester\entities\Action;
use gossi\skilltester\entities\ActionMap;
use gossi\skilltester\entities\ActionMapPeer;
use gossi\skilltester\entities\ActionMapQuery;

/**
 * Base class that represents a query for the 'action_map' table.
 *
 *
 *
 * @method ActionMapQuery orderByParentId($order = Criteria::ASC) Order by the parent_id column
 * @method ActionMapQuery orderByChildId($order = Criteria::ASC) Order by the child_id column
 *
 * @method ActionMapQuery groupByParentId() Group by the parent_id column
 * @method ActionMapQuery groupByChildId() Group by the child_id column
 *
 * @method ActionMapQuery leftJoin($relation) Adds a LEFT JOIN clause to the query
 * @method ActionMapQuery rightJoin($relation) Adds a RIGHT JOIN clause to the query
 * @method ActionMapQuery innerJoin($relation) Adds a INNER JOIN clause to the query
 *
 * @method ActionMapQuery leftJoinAction($relationAlias = null) Adds a LEFT JOIN clause to the query using the Action relation
 * @method ActionMapQuery rightJoinAction($relationAlias = null) Adds a RIGHT JOIN clause to the query using the Action relation
 * @method ActionMapQuery innerJoinAction($relationAlias = null) Adds a INNER JOIN clause to the query using the Action relation
 *
 * @method ActionMap findOne(PropelPDO $con = null) Return the first ActionMap matching the query
 * @method ActionMap findOneOrCreate(PropelPDO $con = null) Return the first ActionMap matching the query, or a new ActionMap object populated from the query conditions when no match is found
 *
 * @method ActionMap findOneByParentId(int $parent_id) Return the first ActionMap filtered by the parent_id column
 * @method ActionMap findOneByChildId(int $child_id) Return the first ActionMap filtered by the child_id column
 *
 * @method array findByParentId(int $parent_id) Return ActionMap objects filtered by the parent_id column
 * @method array findByChildId(int $child_id) Return ActionMap objects filtered by the child_id column
 *
 * @package    propel.generator.gossi.skilltester.entities.om
 */
abstract class BaseActionMapQuery extends ModelCriteria
{
    /**
     * Initializes internal state of BaseActionMapQuery object.
     *
     * @param     string $dbName The dabase name
     * @param     string $modelName The phpName of a model, e.g. 'Book'
     * @param     string $modelAlias The alias for the model in this query, e.g. 'b'
     */
    public function __construct($dbName = 'skilltester', $modelName = 'gossi\\skilltester\\entities\\ActionMap', $modelAlias = null)
    {
        parent::__construct($dbName, $modelName, $modelAlias);
    }

    /**
     * Returns a new ActionMapQuery object.
     *
     * @param     string $modelAlias The alias of a model in the query
     * @param   ActionMapQuery|Criteria $criteria Optional Criteria to build the query from
     *
     * @return ActionMapQuery
     */
    public static function create($modelAlias = null, $criteria = null)
    {
        if ($criteria instanceof ActionMapQuery) {
            return $criteria;
        }
        $query = new ActionMapQuery();
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
     * $obj = $c->findPk(array(12, 34), $con);
     * </code>
     *
     * @param array $key Primary key to use for the query
                         A Primary key composition: [$parent_id, $child_id]
     * @param     PropelPDO $con an optional connection object
     *
     * @return   ActionMap|ActionMap[]|mixed the result, formatted by the current formatter
     */
    public function findPk($key, $con = null)
    {
        if ($key === null) {
            return null;
        }
        if ((null !== ($obj = ActionMapPeer::getInstanceFromPool(serialize(array((string) $key[0], (string) $key[1]))))) && !$this->formatter) {
            // the object is alredy in the instance pool
            return $obj;
        }
        if ($con === null) {
            $con = Propel::getConnection(ActionMapPeer::DATABASE_NAME, Propel::CONNECTION_READ);
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
     * Find object by primary key using raw SQL to go fast.
     * Bypass doSelect() and the object formatter by using generated code.
     *
     * @param     mixed $key Primary key to use for the query
     * @param     PropelPDO $con A connection object
     *
     * @return                 ActionMap A model object, or null if the key is not found
     * @throws PropelException
     */
    protected function findPkSimple($key, $con)
    {
        $sql = 'SELECT `parent_id`, `child_id` FROM `action_map` WHERE `parent_id` = :p0 AND `child_id` = :p1';
        try {
            $stmt = $con->prepare($sql);
            $stmt->bindValue(':p0', $key[0], PDO::PARAM_INT);
            $stmt->bindValue(':p1', $key[1], PDO::PARAM_INT);
            $stmt->execute();
        } catch (Exception $e) {
            Propel::log($e->getMessage(), Propel::LOG_ERR);
            throw new PropelException(sprintf('Unable to execute SELECT statement [%s]', $sql), $e);
        }
        $obj = null;
        if ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $obj = new ActionMap();
            $obj->hydrate($row);
            ActionMapPeer::addInstanceToPool($obj, serialize(array((string) $key[0], (string) $key[1])));
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
     * @return ActionMap|ActionMap[]|mixed the result, formatted by the current formatter
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
     * $objs = $c->findPks(array(array(12, 56), array(832, 123), array(123, 456)), $con);
     * </code>
     * @param     array $keys Primary keys to use for the query
     * @param     PropelPDO $con an optional connection object
     *
     * @return PropelObjectCollection|ActionMap[]|mixed the list of results, formatted by the current formatter
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
     * @return ActionMapQuery The current query, for fluid interface
     */
    public function filterByPrimaryKey($key)
    {
        $this->addUsingAlias(ActionMapPeer::PARENT_ID, $key[0], Criteria::EQUAL);
        $this->addUsingAlias(ActionMapPeer::CHILD_ID, $key[1], Criteria::EQUAL);

        return $this;
    }

    /**
     * Filter the query by a list of primary keys
     *
     * @param     array $keys The list of primary key to use for the query
     *
     * @return ActionMapQuery The current query, for fluid interface
     */
    public function filterByPrimaryKeys($keys)
    {
        if (empty($keys)) {
            return $this->add(null, '1<>1', Criteria::CUSTOM);
        }
        foreach ($keys as $key) {
            $cton0 = $this->getNewCriterion(ActionMapPeer::PARENT_ID, $key[0], Criteria::EQUAL);
            $cton1 = $this->getNewCriterion(ActionMapPeer::CHILD_ID, $key[1], Criteria::EQUAL);
            $cton0->addAnd($cton1);
            $this->addOr($cton0);
        }

        return $this;
    }

    /**
     * Filter the query on the parent_id column
     *
     * Example usage:
     * <code>
     * $query->filterByParentId(1234); // WHERE parent_id = 1234
     * $query->filterByParentId(array(12, 34)); // WHERE parent_id IN (12, 34)
     * $query->filterByParentId(array('min' => 12)); // WHERE parent_id >= 12
     * $query->filterByParentId(array('max' => 12)); // WHERE parent_id <= 12
     * </code>
     *
     * @see       filterByAction()
     *
     * @param     mixed $parentId The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return ActionMapQuery The current query, for fluid interface
     */
    public function filterByParentId($parentId = null, $comparison = null)
    {
        if (is_array($parentId)) {
            $useMinMax = false;
            if (isset($parentId['min'])) {
                $this->addUsingAlias(ActionMapPeer::PARENT_ID, $parentId['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($parentId['max'])) {
                $this->addUsingAlias(ActionMapPeer::PARENT_ID, $parentId['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(ActionMapPeer::PARENT_ID, $parentId, $comparison);
    }

    /**
     * Filter the query on the child_id column
     *
     * Example usage:
     * <code>
     * $query->filterByChildId(1234); // WHERE child_id = 1234
     * $query->filterByChildId(array(12, 34)); // WHERE child_id IN (12, 34)
     * $query->filterByChildId(array('min' => 12)); // WHERE child_id >= 12
     * $query->filterByChildId(array('max' => 12)); // WHERE child_id <= 12
     * </code>
     *
     * @see       filterByAction()
     *
     * @param     mixed $childId The value to use as filter.
     *              Use scalar values for equality.
     *              Use array values for in_array() equivalent.
     *              Use associative array('min' => $minValue, 'max' => $maxValue) for intervals.
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return ActionMapQuery The current query, for fluid interface
     */
    public function filterByChildId($childId = null, $comparison = null)
    {
        if (is_array($childId)) {
            $useMinMax = false;
            if (isset($childId['min'])) {
                $this->addUsingAlias(ActionMapPeer::CHILD_ID, $childId['min'], Criteria::GREATER_EQUAL);
                $useMinMax = true;
            }
            if (isset($childId['max'])) {
                $this->addUsingAlias(ActionMapPeer::CHILD_ID, $childId['max'], Criteria::LESS_EQUAL);
                $useMinMax = true;
            }
            if ($useMinMax) {
                return $this;
            }
            if (null === $comparison) {
                $comparison = Criteria::IN;
            }
        }

        return $this->addUsingAlias(ActionMapPeer::CHILD_ID, $childId, $comparison);
    }

    /**
     * Filter the query by a related Action object
     *
     * @param   Action $action The related object to use as filter
     * @param     string $comparison Operator to use for the column comparison, defaults to Criteria::EQUAL
     *
     * @return                 ActionMapQuery The current query, for fluid interface
     * @throws PropelException - if the provided filter is invalid.
     */
    public function filterByAction($action, $comparison = null)
    {
        if ($action instanceof Action) {
            return $this
                ->addUsingAlias(ActionMapPeer::PARENT_ID, $action->getId(), $comparison)
                ->addUsingAlias(ActionMapPeer::CHILD_ID, $action->getId(), $comparison);
        } else {
            throw new PropelException('filterByAction() only accepts arguments of type Action');
        }
    }

    /**
     * Adds a JOIN clause to the query using the Action relation
     *
     * @param     string $relationAlias optional alias for the relation
     * @param     string $joinType Accepted values are null, 'left join', 'right join', 'inner join'
     *
     * @return ActionMapQuery The current query, for fluid interface
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
     * Exclude object from result
     *
     * @param   ActionMap $actionMap Object to remove from the list of results
     *
     * @return ActionMapQuery The current query, for fluid interface
     */
    public function prune($actionMap = null)
    {
        if ($actionMap) {
            $this->addCond('pruneCond0', $this->getAliasedColName(ActionMapPeer::PARENT_ID), $actionMap->getParentId(), Criteria::NOT_EQUAL);
            $this->addCond('pruneCond1', $this->getAliasedColName(ActionMapPeer::CHILD_ID), $actionMap->getChildId(), Criteria::NOT_EQUAL);
            $this->combine(array('pruneCond0', 'pruneCond1'), Criteria::LOGICAL_OR);
        }

        return $this;
    }

}
