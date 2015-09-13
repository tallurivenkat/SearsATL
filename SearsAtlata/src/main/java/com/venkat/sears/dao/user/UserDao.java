package com.venkat.sears.dao.user;

import com.venkat.sears.dao.Dao;
import com.venkat.sears.entity.User;

import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserDao extends Dao<User, Long>, UserDetailsService
{

	User findByName(String name);

}