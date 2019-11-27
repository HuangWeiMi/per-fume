import Perfume from '../src/perfume';
import mock from './_mock';

describe('Perfume', () => {
  let perfume: Perfume;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    mock.performance();
    perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    (window as any).ga = undefined;
    (window as any).PerformanceObserver = mock.PerformanceObserver;
    (window as any).console.log = (n: any) => n;
    (window as any).console.warn = (n: any) => n;
    perfume['perfObservers'] = {};
  });

  afterEach(() => {
    if (spy) {
      spy.mockReset();
      spy.mockRestore();
    }
  });

  describe('config', () => {
    const instance = new Perfume();

    it('should be defined', () => {
      expect(instance.config.firstContentfulPaint).toEqual(false);
      expect(instance.config.firstPaint).toEqual(false);
      expect(instance.config.firstInputDelay).toEqual(false);
      expect(instance.config.dataConsumption).toEqual(false);
      expect(instance.config.navigationTiming).toEqual(false);
      expect(instance.config.resourceTiming).toEqual(false);
      expect(instance.config.analyticsTracker).toBeDefined();
      expect(instance.config.logPrefix).toEqual('Perfume.js:');
      expect(instance.config.logging).toEqual(true);
      expect(instance.config.maxMeasureTime).toEqual(15000);
      expect(instance.config.warning).toEqual(false);
    });
  });

  describe('constructor', () => {
    it('should run with config version A', () => {
      new Perfume({
        firstContentfulPaint: true,
        firstPaint: true,
        firstInputDelay: true,
        dataConsumption: true,
      });
    });

    it('should run with config version B', () => {
      new Perfume({
        firstContentfulPaint: true,
        firstPaint: true,
        firstInputDelay: true,
        dataConsumption: true,
        resourceTiming: true,
      });
    });

    it('should run with config version C', () => {
      new Perfume({
        firstContentfulPaint: true,
        firstPaint: true,
        firstInputDelay: true,
        dataConsumption: true,
        logging: false,
      });
    });

    it('should run with config version D', () => {
      new Perfume({
        firstContentfulPaint: true,
        firstPaint: true,
        firstInputDelay: true,
        dataConsumption: true,
        warning: true,
      });
    });

    it('should run with config version E', () => {
      new Perfume({
        firstContentfulPaint: true,
        firstPaint: true,
        firstInputDelay: true,
        dataConsumption: true,
        navigationTiming: true,
        warning: true,
      });
    });
  });

  describe('.start()', () => {
    beforeEach(() => {
      perfume = new Perfume({ ...mock.defaultPerfumeConfig });
    });

    it('should throw a logWarn if metricName is not passed', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Missing metric name');
    });

    it('should not throw a logWarn if param is correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call performanceMark', () => {
      spy = jest.spyOn((perfume as any), 'performanceMark');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName', 'start');
    });

    it('should throw a logWarn if recording already started', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      perfume.start('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Recording already started.');
    });
  });

  describe('.end()', () => {
    it('should throw a logWarn if param is not correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.end('');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Missing metric name');
    });

    it('should throw a logWarn if param is correct and recording already stopped', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Recording already stopped.');
    });

    it('should call log() with correct params', () => {
      spy = jest.spyOn(perfume as any, 'log');
      perfume.config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        duration: 12346,
      });
    });

    it('should call sendTiming() with correct params', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      perfume.config.logging = true;
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        duration: 12346,
      });
    });

    it('should add metrics properly', () => {
      perfume = new Perfume();
      perfume.start('metricName');
      expect(perfume['metrics']['metricName']).toBeDefined();
    });

    it('should delete metrics properly', () => {
      perfume = new Perfume();
      perfume.start('metricName');
      perfume.end('metricName');
      expect(perfume['metrics']['metricName']).not.toBeDefined();
    });
  });

  describe('.start() and .end()', () => {
    it('should not throw a logWarn if param is correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call performanceMark() twice with the correct arguments', () => {
      spy = jest.spyOn((perfume as any), 'performanceMark');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(2);
    });

    it('should call performanceMeasure() with the correct arguments', () => {
      spy = jest.spyOn((perfume as any), 'performanceMeasure');
      perfume.start('metricName');
      perfume.end('metricName');
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('metricName');
    });
  });

  describe('.endPaint()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should call end() after the first setTimeout', () => {
      spy = jest.spyOn(perfume, 'end');
      perfume.endPaint('test').catch(console.error);
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.log()', () => {
    it('should not call window.console.log() if logging is disabled', () => {
      perfume.config.logging = false;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({ metricName: '', duration: 0 });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if logging is enabled', () => {
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({ metricName: 'metricName', duration: 1235 });
      const text = '%c Perfume.js: metricName 1235.00 ms';
      const style = 'color: #ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style);
    });

    it('should call logWarn if params are not correct', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (perfume as any).log({ metricName: '', duration: 0 });
      const text = 'Missing metric name';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text);
    });

    it('should not call window.console.log() if params are not correct', () => {
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({ metricName: '', duration: 0 });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call window.console.log() if params are correct', () => {
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({ metricName: 'metricName', duration: 1245 });
      const text = '%c Perfume.js: metricName 1245.00 ms';
      const style = 'color: #ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style);
    });

    it('should call window.console.log() with data', () => {
      const data = {};
      perfume.config.logging = true;
      spy = jest.spyOn(window.console, 'log');
      (perfume as any).log({ metricName: 'metricName', data });
      const text = '%c Perfume.js: metricName ';
      const style = 'color: #ff6d00;font-size:11px;';
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(text, style, data);
    });
  });

  describe('.sendTiming()', () => {
    it('should not call analyticsTracker() if isHidden is true', () => {
      perfume.config.analyticsTracker = ({ metricName, duration }) => {};
      spy = jest.spyOn(perfume.config, 'analyticsTracker');
      perfume['isHidden'] = true;
      (perfume as any).sendTiming({ metricName: 'metricName', duration: 123 });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call analyticsTracker() if analyticsTracker is defined', () => {
      perfume.config.analyticsTracker = ({ metricName, duration }) => {};
      spy = jest.spyOn(perfume.config, 'analyticsTracker');
      (perfume as any).sendTiming({ metricName: 'metricName', duration: 123 });
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith({
        metricName: 'metricName',
        duration: 123,
      });
    });
  });

  describe('.checkMetricName()', () => {
    it('should return "true" when provided a metric name', () => {
      const value = (perfume as any).checkMetricName('metricName');
      expect(value).toEqual(true);
    });

    it('should call logWarn when not provided a metric name', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (perfume as any).checkMetricName();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('Missing metric name');
    });

    it('should return "false" when not provided a metric name', () => {
      const value = (perfume as any).checkMetricName();
      expect(value).toEqual(false);
    });
  });

  describe('.didVisibilityChange()', () => {
    it('should keep "hidden" default value when is false', () => {
      perfume['didVisibilityChange']();
      expect(perfume['isHidden']).toEqual(false);
    });

    it('should set "hidden" value when is true', () => {
      perfume['isHidden'] = false;
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      perfume['didVisibilityChange']();
      expect(perfume['isHidden']).toEqual(true);
    });

    it('should keep "hidden" value when changes to false', () => {
      perfume['isHidden'] = true;
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      perfume['didVisibilityChange']();
      expect(perfume['isHidden']).toEqual(true);
    });
  });

  describe('.performanceObserverCb()', () => {
    beforeEach(() => {
      perfume.config.firstPaint = true;
      perfume.config.firstContentfulPaint = true;
      (perfume as any).perfObservers.firstContentfulPaint = {
        disconnect: () => {},
      };
      (perfume as any).perfObservers.firstInputDelay = {
        disconnect: () => {},
      };
    });

    it('should call logMetric() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).performanceObserverCb({
        entries: mock.entries,
        entryName: 'first-paint',
        metricLog: 'First Paint',
        metricName: 'firstPaint',
        valueLog: 'startTime',
      });
      (perfume as any).performanceObserverCb({
        entries: mock.entries,
        entryName: 'first-contentful-paint',
        metricLog: 'First Contentful Paint',
        metricName: 'firstContentfulPaint',
        valueLog: 'startTime',
      });
      expect(spy.mock.calls.length).toEqual(2);
      expect(spy).toHaveBeenCalledWith(1, 'First Paint', 'firstPaint');
      expect(spy).toHaveBeenCalledWith(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
    });

    it('should not call logMetric() when firstPaint and firstContentfulPaint is false', () => {
      perfume.config.firstPaint = false;
      perfume.config.firstContentfulPaint = false;
      spy = jest.spyOn(perfume as any, 'logMetric');
      (perfume as any).performanceObserverCb({
        entries: mock.entries,
        entryName: 'first-paint',
        metricLog: 'First Paint',
        metricName: 'firstPaint',
        valueLog: 'startTime',
      });
      (perfume as any).performanceObserverCb({
        entries: mock.entries,
        entryName: 'first-contentful-paint',
        metricLog: 'First Contentful Paint',
        metricName: 'firstContentfulPaint',
        valueLog: 'startTime',
      });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call disconnect() for firstInputDelay when metricName is firstInputDelay', () => {
      spy = jest.spyOn(
        (perfume as any).perfObservers.firstInputDelay,
        'disconnect',
      );
      (perfume as any).performanceObserverCb({
        entries: [],
        metricLog: 'First Input Delay',
        metricName: 'firstInputDelay',
        valueLog: 'duration',
      });
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should not call disconnect() for firstInputDelay when metricName is not firstInputDelay', () => {
      spy = jest.spyOn(
        (perfume as any).perfObservers.firstInputDelay,
        'disconnect',
      );
      (perfume as any).performanceObserverCb({
        entries: [],
        metricLog: 'First Input Delay',
        metricName: 'firstInputDelay',
        valueLog: 'duration',
      });
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.performanceObserverResourceCb()', () => {
    beforeEach(() => {
      (perfume as any).dataConsumption = {
        css: 0,
        fetch: 0,
      };
      perfume.config.dataConsumption = true;
      (perfume as any).perfObservers.dataConsumption = { disconnect: () => {} };
    });

    it('should dataConsumption be 0 when entries are empty', () => {
      (perfume as any).performanceObserverResourceCb({
        entries: [],
      });
      expect((perfume as any).dataConsumption).toEqual({
        css: 0,
        fetch: 0,
      });
    });

    it('should float the dataConsumption result', () => {
      (perfume as any).performanceObserverResourceCb({
        entries: [
          {
            decodedBodySize: 12345678,
            initiatorType: 'css'
          },
        ],
      });
      expect((perfume as any).dataConsumption).toEqual({
        css: 12345.678,
        fetch: 0,
      });
    });

    it('should sum the dataConsumption result', () => {
      (perfume as any).performanceObserverResourceCb({
        entries: [
          {
            decodedBodySize: 12345678,
            initiatorType: 'css'
          },
          {
            decodedBodySize: 10000678,
            initiatorType: 'fetch'
          },
        ],
      });
      expect((perfume as any).dataConsumption).toEqual({
        css: 12345.678,
        fetch: 10000.678,
      });
    });
  });

  describe('.initFirstPaint()', () => {
    beforeEach(() => {
      perfume.config.firstPaint = true;
      perfume.config.firstContentfulPaint = true;
    });

    it('should call performanceObserver()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should throw a logWarn if fails', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (window as any).chrome = true;
      mock.PerformanceObserver.simulateErrorOnObserve = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstPaint']();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('FP:failed');
    });
  });

  describe('.digestFirstInputDelayEntries()', () => {
    it('should call performanceObserver()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserverCb');
      perfume['digestFirstInputDelayEntries']([]);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        entries: [],
        metricLog: 'First Input Delay',
        metricName: 'firstInputDelay',
        valueLog: 'duration',
      });
    });

    it('should call disconnectDataConsumption()', () => {
      spy = jest.spyOn(perfume as any, 'disconnectDataConsumption');
      perfume['digestFirstInputDelayEntries']([]);
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.initFirstInputDelay()', () => {
    beforeEach(() => {
      perfume.config.firstInputDelay = true;
    });

    it('should call performanceObserver()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstInputDelay']();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should throw a logWarn if fails', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (window as any).chrome = true;
      mock.PerformanceObserver.simulateErrorOnObserve = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initFirstInputDelay']();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('FID:failed');
    });
  });

  describe('.disconnectDataConsumption()', () => {
    beforeEach(() => {
      (perfume as any).dataConsumptionTimeout = 12345;
    });

    it('should call logData() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'logData');
      (perfume as any).disconnectDataConsumption();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(
        'dataConsumption',
        (perfume as any).dataConsumption,
      );
    });
  });

  describe('.initResourceTiming()', () => {
    beforeEach(() => {
      perfume.config.dataConsumption = true;
      (perfume as any).perfObservers.dataConsumption = { disconnect: () => {} };
    });

    it('should call performanceObserver()', () => {
      spy = jest.spyOn(perfume as any, 'performanceObserver');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should call disconnectDataConsumption() after the setTimeout', () => {
      jest.spyOn(perfume as any, 'performanceObserver');
      spy = jest.spyOn(perfume as any, 'disconnectDataConsumption');
      (window as any).chrome = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      jest.runAllTimers();
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should throw a logWarn if fails', () => {
      spy = jest.spyOn(perfume as any, 'logWarn');
      (window as any).chrome = true;
      mock.PerformanceObserver.simulateErrorOnObserve = true;
      (window as any).PerformanceObserver = mock.PerformanceObserver;
      perfume['initResourceTiming']();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith('DataConsumption:failed');
    });
  });

  describe('.onVisibilityChange()', () => {
    it('should not call document.addEventListener() when document.hidden is undefined', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(undefined as any);
      (perfume as any).onVisibilityChange();
      expect(spy.mock.calls.length).toEqual(0);
    });

    it('should call document.addEventListener() with the correct argument', () => {
      spy = jest.spyOn(document, 'addEventListener');
      jest.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      (perfume as any).onVisibilityChange();
      expect(spy.mock.calls.length).toEqual(1);
      expect(document.addEventListener).toHaveBeenLastCalledWith(
        'visibilitychange',
        perfume['didVisibilityChange'],
      );
    });
  });

  describe('.logMetric()', () => {
    it('should call log() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'log');
      (perfume as any).logMetric(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'First Contentful Paint',
        duration: 1,
        suffix: 'ms',
      });
    });

    it('should call sendTiming() with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logMetric(
        1,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith({
        metricName: 'firstContentfulPaint',
        duration: 1,
      });
    });

    it('should not call sendTiming() when duration is higher of config.maxMeasureTime', () => {
      spy = jest.spyOn(perfume as any, 'sendTiming');
      (perfume as any).logMetric(
        20000,
        'First Contentful Paint',
        'firstContentfulPaint',
      );
      expect(spy.mock.calls.length).toEqual(0);
    });
  });

  describe('.logWarn()', () => {
    it('should throw a console.warn if config.warning is true', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.warning = true;
      (perfume as any).logWarn('message');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy).toHaveBeenCalledWith(perfume.config.logPrefix, 'message');
    });

    it('should not throw a console.warn if config.warning is false', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.warning = false;
      (perfume as any).logWarn('message');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not throw a console.warn if config.logging is false', () => {
      spy = jest.spyOn(window.console, 'warn');
      perfume.config.warning = true;
      perfume.config.logging = false;
      (perfume as any).logWarn('message');
      expect(spy.mock.calls.length).toEqual(0);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('.isPerformanceSupported()', () => {
    it('should return true if the browser supports the Navigation Timing API', () => {
      expect((perfume as any).isPerformanceSupported()).toEqual(true);
    });

    it('should return false if the browser does not supports performance.mark', () => {
      delete window.performance.mark;
      expect((perfume as any).isPerformanceSupported()).toEqual(false);
    });

    it('should return false if the browser does not supports performance.now', () => {
      window.performance.mark = () => 1;
      delete window.performance.now;
      expect((perfume as any).isPerformanceSupported()).toEqual(false);
    });
  });

  describe('.getNavigationTiming()', () => {
    it('when performance is not supported should return an empty object', () => {
      delete window.performance.mark;
      expect((perfume as any).getNavigationTiming()).toEqual({});
    });

    it('when performance is supported should return the correct value', () => {
      perfume.config.navigationTiming = true;
      expect((perfume as any).getNavigationTiming()).toEqual({
        dnsLookupTime: 0,
        downloadTime: 0.6899998988956213,
        fetchTime: 4.435000009834766,
        headerSize: 0,
        timeToFirstByte: 3.745000110939145,
        totalTime: 4.435000009834766,
        workerTime: 4.435000009834766,
      });
    });

    it('when workerStart is 0 should return 0', () => {
      perfume.config.navigationTiming = true;
      jest.spyOn(window.performance, 'getEntriesByType').mockReturnValue([{
        workerTime: 0,
      }] as any);
      expect((perfume as any).getNavigationTiming().workerTime).toEqual(0);
    });

    it('when Navigation Timing is not supported yet should return an empty object', () => {
      perfume.config.navigationTiming = true;
      jest.spyOn(window.performance, 'getEntriesByType').mockReturnValue([] as any);
      expect((perfume as any).getNavigationTiming()).toEqual({});
    });
  });

  describe('.performanceMark()', () => {
    it('should call window.performance.mark with undefined argument', () => {
      spy = jest.spyOn((perfume as any).wp, 'mark');
      (perfume as any).performanceMark('fibonacci');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_fibonacci_undefined');
    });

    it('should call window.performance.mark with the correct argument', () => {
      spy = jest.spyOn((perfume as any).wp, 'mark');
      (perfume as any).performanceMark('fibonacci', 'fast');
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('mark_fibonacci_fast');
    });
  });

  describe('.performanceMeasure()', () => {
    it('should call window.performance.measure with the correct arguments', () => {
      spy = jest.spyOn((perfume as any).wp, 'measure');
      (perfume as any).performanceMeasure('fibonacci');
      const start = 'mark_fibonacci_start';
      const end = 'mark_fibonacci_end';
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci', start, end);
    });

    it('should call getDurationByMetric with the correct arguments', () => {
      spy = jest.spyOn(perfume as any, 'getDurationByMetric');
      (perfume as any).performanceMeasure('fibonacci', {});
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy).toHaveBeenCalledWith('fibonacci');
    });
  });

  describe('.performanceObserver()', () => {
    it('should call PerformanceObserver', () => {
      spy = jest.spyOn(window, 'PerformanceObserver' as any);
      (perfume as any).performanceObserver('paint', () => 0);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls.length).toEqual(1);
    });
  });

  describe('.getDurationByMetric()', () => {
    it('should return entry.duration when entryType is not measure', () => {
      window.performance.getEntriesByName = () =>
        [{ duration: 12345, entryType: 'notMeasure' } as any] as any[];
      const value = (perfume as any).getDurationByMetric('metricName');
      expect(value).toEqual(-1);
    });

    it('should return -1 when entryType is a measure', () => {
      const value = (perfume as any).getDurationByMetric('metricName');
      expect(value).toEqual(12346);
    });
  });
});
