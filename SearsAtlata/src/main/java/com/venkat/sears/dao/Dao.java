package com.venkat.sears.dao;

import java.util.List;

import com.venkat.sears.entity.Entity;


public interface Dao<T extends Entity, I>
{

	List<T> findAll();


	T find(I id);


	T save(T newsEntry);


	void delete(I id);

}