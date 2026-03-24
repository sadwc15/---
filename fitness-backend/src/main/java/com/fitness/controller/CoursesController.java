package com.fitness.controller;

import java.util.List;
import com.fitness.entity.Courses;
import com.fitness.utils.AjaxResult;
import com.fitness.utils.TableDataInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fitness.service.ICoursesService;

@RestController
@RequestMapping("/fitness-backend/course")
public class CoursesController extends BaseController
{
    @Autowired
    private ICoursesService coursesService;

    /**
     * 查询课程管理列表
     */
    @GetMapping("/list")
    public TableDataInfo list(Courses courses)
    {
        startPage();
        List<Courses> list = coursesService.selectCoursesList(courses);
        return getDataTable(list);
    }

    /**
     * 获取课程管理详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(coursesService.selectCoursesById(id));
    }

    /**
     * 新增课程管理
     */
    @PostMapping
    public AjaxResult add(@RequestBody Courses courses)
    {
        return toAjax(coursesService.insertCourses(courses));
    }

    /**
     * 修改课程管理
     */
    @PutMapping
    public AjaxResult edit(@RequestBody Courses courses)
    {
        return toAjax(coursesService.updateCourses(courses));
    }

    /**
     * 删除课程管理
     */
	@DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(coursesService.deleteCoursesByIds(ids));
    }
}
