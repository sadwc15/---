package com.fitness.utils;

/**
 * @Auther: shifk
 * @Date: 2026/3/15 - 03 - 15 - 13:30
 * @Description: com.fitness.utils
 * @version: 1.0
 */
public class UtilException extends RuntimeException
{
    private static final long serialVersionUID = 8247610319171014183L;

    public UtilException(Throwable e)
    {
        super(e.getMessage(), e);
    }

    public UtilException(String message)
    {
        super(message);
    }

    public UtilException(String message, Throwable throwable)
    {
        super(message, throwable);
    }
}
