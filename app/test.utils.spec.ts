import { spy, stub } from 'sinon';

export const mockRequest = (options = {}): Record<string, unknown> => ({
    body: {},
    cookies: {},
    query: {},
    params: {},
    headers: {},
    get: stub(),
    ...options
});

export const mockResponse = (options: Record<string, unknown> = {}): Record<string, unknown> => {
    const res = {
        cookie: spy(),
        clearCookie: spy(),
        download: spy(),
        format: spy(),
        getHeader: spy(),
        json: spy(),
        jsonp: spy(),
        send: spy(),
        sendFile: spy(),
        sendStatus: spy(),
        setHeader: spy(),
        redirect: spy(),
        render: spy(),
        end: spy(),
        set: spy(),
        type: spy(),
        get: stub(),
        ...options,
        status: stub(),
        vary: stub()
    }
    res.status = stub().returns(res)
    res.vary = stub().returns(res)
    return res
}

