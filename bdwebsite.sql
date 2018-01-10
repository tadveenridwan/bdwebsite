-- phpMyAdmin SQL Dump
-- version 2.11.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 10, 2018 at 02:42 PM
-- Server version: 5.0.67
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `bdwebsite`
--

-- --------------------------------------------------------

--
-- Table structure for table `contactus`
--

CREATE TABLE IF NOT EXISTS `contactus` (
  `id` int(12) NOT NULL auto_increment,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `email` text NOT NULL,
  `subject` varchar(35) NOT NULL,
  `message` varchar(255) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `contactus`
--

INSERT INTO `contactus` (`id`, `firstname`, `lastname`, `email`, `subject`, `message`) VALUES
(7, 'Apu', 'Arif', 'arif@gmail.com', 'JS', 'Hello World');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE IF NOT EXISTS `employee` (
  `id` int(12) NOT NULL auto_increment,
  `username` varchar(35) NOT NULL,
  `password` varchar(35) NOT NULL,
  `fname` varchar(35) NOT NULL,
  `lname` varchar(35) NOT NULL,
  `gender` varchar(25) NOT NULL,
  `email` varchar(35) NOT NULL,
  `mobile` varchar(30) NOT NULL,
  `categoryType` varchar(35) NOT NULL,
  `confirmation` varchar(35) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `username`, `password`, `fname`, `lname`, `gender`, `email`, `mobile`, `industryType`, `confirmation`) VALUES
(7, 'Rafan', '12345678', 'Rafan', 'Rafu', 'male', 'rafu@gmail.com', '01254879', '2', 'confirmed'),
(5, 'Arif', '12345678', 'Arif', 'Apu', 'male', 'arif@gmail.com', '01626269286', '1', 'confirmed'),


-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(12) NOT NULL auto_increment,
  `start` varchar(35) NOT NULL,
  `end` varchar(35) NOT NULL,
  `person` varchar(35) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `start`, `end`, `person`) VALUES
(1, '2018-01-10', '2018-01-12', 'Arif'),
(2, '2018-01-10', '2018-01-12', 'Apu'),
(3, '2018-01-16', '2018-01-19', 'Rafan'),

