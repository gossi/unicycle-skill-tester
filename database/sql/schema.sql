
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- trick
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `trick`;

CREATE TABLE `trick`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100),
    PRIMARY KEY (`id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- action
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `action`;

CREATE TABLE `action`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(45) DEFAULT 'boolean',
    PRIMARY KEY (`id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- action_map
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `action_map`;

CREATE TABLE `action_map`
(
    `parent_id` INTEGER NOT NULL,
    `child_id` INTEGER NOT NULL,
    PRIMARY KEY (`parent_id`,`child_id`),
    INDEX `fk_action_has_action_action2_idx` (`child_id`),
    INDEX `fk_action_has_action_action1_idx` (`parent_id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- group
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `group`;

CREATE TABLE `group`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- item
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item`
(
    `trick_id` INTEGER NOT NULL,
    `group_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    PRIMARY KEY (`trick_id`,`group_id`,`action_id`),
    INDEX `fk_trick_has_group_group1_idx` (`group_id`),
    INDEX `fk_trick_has_group_trick_idx` (`trick_id`),
    INDEX `fk_items_action1_idx` (`action_id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- feedback
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trick_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `percent` INTEGER,
    `weight` INTEGER,
    `max` INTEGER,
    `inverted` TINYINT(1),
    `mistake` VARCHAR(45),
    PRIMARY KEY (`id`),
    INDEX `fk_trick_has_action_action1_idx` (`action_id`),
    INDEX `fk_trick_has_action_trick1_idx` (`trick_id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- value
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `value`;

CREATE TABLE `value`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feedback_id` INTEGER NOT NULL,
    `value` VARCHAR(45),
    `range` VARCHAR(45),
    `mistake` VARCHAR(45),
    PRIMARY KEY (`id`),
    INDEX `fk_values_feedback1_idx` (`feedback_id`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- action_i18n
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `action_i18n`;

CREATE TABLE `action_i18n`
(
    `id` INTEGER NOT NULL,
    `locale` VARCHAR(5) DEFAULT 'de' NOT NULL,
    `title` VARCHAR(100),
    `description` TEXT,
    PRIMARY KEY (`id`,`locale`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- group_i18n
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `group_i18n`;

CREATE TABLE `group_i18n`
(
    `id` INTEGER NOT NULL,
    `locale` VARCHAR(5) DEFAULT 'de' NOT NULL,
    `title` VARCHAR(45),
    `description` TEXT,
    PRIMARY KEY (`id`,`locale`)
) ENGINE=MyISAM;

-- ---------------------------------------------------------------------
-- value_i18n
-- ---------------------------------------------------------------------

DROP TABLE IF EXISTS `value_i18n`;

CREATE TABLE `value_i18n`
(
    `id` INTEGER NOT NULL,
    `locale` VARCHAR(5) DEFAULT 'de' NOT NULL,
    `text` TEXT,
    PRIMARY KEY (`id`,`locale`)
) ENGINE=MyISAM;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
