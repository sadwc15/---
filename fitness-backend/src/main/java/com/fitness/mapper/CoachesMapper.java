package com.fitness.mapper;

import java.util.List;
import com.fitness.entity.Coaches;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CoachesMapper
{
    /**
     * 查询教练信息管理
     *
     * @param id 教练信息管理主键
     * @return 教练信息管理
     */
    public Coaches selectCoachesById(Long id);

    /**
     * 查询教练信息管理列表
     *
     * @param coaches 教练信息管理
     * @return 教练信息管理集合
     */
    public List<Coaches> selectCoachesList(Coaches coaches);

    /**
     * 新增教练信息管理
     *
     * @param coaches 教练信息管理
     * @return 结果
     */
    public int insertCoaches(Coaches coaches);

    /**
     * 修改教练信息管理
     *
     * @param coaches 教练信息管理
     * @return 结果
     */
    public int updateCoaches(Coaches coaches);

    /**
     * 删除教练信息管理
     *
     * @param id 教练信息管理主键
     * @return 结果
     */
    public int deleteCoachesById(Long id);

    /**
     * 批量删除教练信息管理
     *
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteCoachesByIds(Long[] ids);
}
