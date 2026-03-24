package com.fitness.controller;

import java.util.List;
import com.fitness.entity.Coaches;
import com.fitness.utils.AjaxResult;
import com.fitness.utils.TableDataInfo;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fitness.service.ICoachesService;


@RestController
@RequestMapping("/fitness-backend/coaches")
public class CoachesController extends BaseController
{
    @Autowired
    private ICoachesService coachesService;

    /**
     * 查询教练信息管理列表
     */
    @GetMapping("/list")
    public TableDataInfo list(Coaches coaches)
    {
        startPage();
        List<Coaches> list = coachesService.selectCoachesList(coaches);
        return getDataTable(list);
    }

    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(coachesService.selectCoachesById(id));
    }

    @PostMapping
    public AjaxResult add(@RequestBody Coaches coaches)
    {
        return toAjax(coachesService.insertCoaches(coaches));
    }

    @PutMapping
    public AjaxResult edit(@RequestBody Coaches coaches)
    {
        return toAjax(coachesService.updateCoaches(coaches));
    }
	@DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        return toAjax(coachesService.deleteCoachesByIds(ids));
    }
}
