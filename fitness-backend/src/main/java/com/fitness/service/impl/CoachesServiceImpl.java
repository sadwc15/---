package com.fitness.service.impl;

import java.util.List;

import com.fitness.entity.Coaches;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fitness.mapper.CoachesMapper;
import com.fitness.service.ICoachesService;


@Service
public class CoachesServiceImpl implements ICoachesService
{
    @Autowired
    private CoachesMapper coachesMapper;

    /**
     * 查询教练信息管理
     *
     * @param id 教练信息管理主键
     * @return 教练信息管理
     */
    @Override
    public Coaches selectCoachesById(Long id)
    {
        return coachesMapper.selectCoachesById(id);
    }

    /**
     * 查询教练信息管理列表
     *
     * @param coaches 教练信息管理
     * @return 教练信息管理
     */
    @Override
    public List<Coaches> selectCoachesList(Coaches coaches)
    {
        return coachesMapper.selectCoachesList(coaches);
    }

    /**
     * 新增教练信息管理
     *
     * @param coaches 教练信息管理
     * @return 结果
     */
    @Override
    public int insertCoaches(Coaches coaches)
    {
        return coachesMapper.insertCoaches(coaches);
    }

    /**
     * 修改教练信息管理
     *
     * @param coaches 教练信息管理
     * @return 结果
     */
    @Override
    public int updateCoaches(Coaches coaches)
    {
        return coachesMapper.updateCoaches(coaches);
    }

    /**
     * 批量删除教练信息管理
     *
     * @param ids 需要删除的教练信息管理主键
     * @return 结果
     */
    @Override
    public int deleteCoachesByIds(Long[] ids)
    {
        return coachesMapper.deleteCoachesByIds(ids);
    }

    /**
     * 删除教练信息管理信息
     *
     * @param id 教练信息管理主键
     * @return 结果
     */
    @Override
    public int deleteCoachesById(Long id)
    {
        return coachesMapper.deleteCoachesById(id);
    }
}
