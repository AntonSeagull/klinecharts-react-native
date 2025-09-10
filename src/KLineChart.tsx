import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import {
    Animated,
    type GestureResponderEvent,
    Text,
    View,
    type ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';

import type Coordinate from './types';
import type {
    DeepPartial,
    FontBase64Type,
    IndicatorCreate,
    IndicatorFilter,
    KLineChartRef,
    KLineData,
    LoadDataMore,
    Options,
    PaneOptions,
    Precision,
    Styles,
} from './types';
import { getWebContent } from './webContent';

export interface ConvertFilter {
    paneId?: string
    absolute?: boolean
}

type KLineChartProps = {
    debug?: boolean,
    fadeInOnInit?: boolean;
    fadeInDuration?: number;
    dataList?: KLineData[],
    options: Options
    onInited?: () => void,
    precision?: Partial<Precision>,
    style: ViewStyle;
    onTouchStart?: ((event: GestureResponderEvent) => void) & (() => void),
    onTouchEnd?: ((event: GestureResponderEvent) => void) & (() => void),
    klinechartsUrl?: string;

    onWebViewError?: (syntheticEvent: WebViewErrorEvent) => void,

    indicators?: {
        value: string | IndicatorCreate,
        isStack?: boolean,
        paneOptions?: PaneOptions
    }[],

    base64Fonts?: FontBase64Type[]



};

const defaultKLineChartsUrl = "https://cdn.jsdelivr.net/npm/klinecharts@10.0.0-alpha2/dist/umd/klinecharts.min.js";


export const KLineChart = forwardRef<KLineChartRef, KLineChartProps>((props, ref) => {

    const webViewRef = useRef<any>();

    const [html, setHtml] = useState<string>('');

    const sendToWebView = useCallback((message: { function: string; params: any }) => {

        setDebugMessage("calling function: " + message.function);

        webViewRef.current?.postMessage(JSON.stringify(message));


    }, []);

    useEffect(() => {

        if (html) return;



        getWebContent(props?.klinechartsUrl ?? defaultKLineChartsUrl,
            Object.keys(functionsMirror).map((key) => {
                return functionsMirror[key as keyof typeof functionsMirror].web;
            }).join('\n'), props.base64Fonts ?? []

        ).then(res => {
            setHtml(res);
        });
    }, []);


    const fadeAnim = useRef(new Animated.Value(0)).current;

    const stylesRef = useRef<string | null>(null)

    const dataListRef = useRef<string | null>(null)

    const indicatorsRef = useRef<string | null>(null);

    const [inited, setInited] = useState<boolean>(false);

    const precisionRef = useRef<string | null>(null);

    useEffect(() => {
        if (inited && (props.fadeInOnInit ?? true)) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: props.fadeInDuration ?? 500,
                useNativeDriver: true,
            }).start();
        }
    }, [inited]);

    const updateProps = () => {


        if (webViewRef.current) {

            if (inited) {

                let newStyles = JSON.stringify(props.options.styles)
                if (props.options.styles && stylesRef.current !== newStyles) {
                    stylesRef.current = newStyles;
                    functionsMirror.setStyles.native(props.options.styles);
                    setDebugMessage('call setStyles');
                }

                if (props.precision && JSON.stringify(props.precision) !== precisionRef.current) {
                    precisionRef.current = JSON.stringify(props.precision);
                    functionsMirror.setPrecision.native(props.precision);
                    setDebugMessage('call setPrecision');
                }

                if (props.dataList && JSON.stringify(props.dataList) !== dataListRef.current) {
                    dataListRef.current = JSON.stringify(props.dataList);
                    functionsMirror.applyNewData.native(props.dataList);
                    setDebugMessage('call updateData');
                }

                if (props.indicators && JSON.stringify(props.indicators) !== indicatorsRef.current) {
                    indicatorsRef.current = JSON.stringify(props.indicators);
                    functionsMirror.removeIndicator.native()
                    props.indicators.forEach(indicator => {



                        functionsMirror.createIndicator.native(indicator.value, indicator.isStack, indicator.paneOptions);
                    });
                    setDebugMessage('call createIndicator');
                }

            }



        }

    }

    useEffect(() => {
        updateProps();
    }, [props.options, props.dataList, props.precision, props.indicators, inited]);

    const onLoadEnd = () => {
        setDebugMessage('WebView loaded');
        functionsMirror.init.native(props.options);

    }
    const onReceiveMessageFromWebView = (data: string) => {

        if (data == 'inited') {
            props.onInited?.();
            setInited(true);

            setDebugMessage('call onInited');
            return;
        }


    };


    const functionsMirror = {

        setPrecision: {
            native: (precision: Partial<Precision>) => {
                sendToWebView({
                    function: 'setPrecision',
                    params: {
                        precision: precision
                    }
                });
            },
            web: `
             if(functionName === 'setPrecision') {
                 kchart.setPrecision(params.precision);
                }`
        },

        init: {
            native: (options: Options) => {
                sendToWebView({
                    function: 'init',
                    params: {
                        options: options
                    }
                });
            },
            web: `
             if(functionName === 'init') {

                //Remove all child nodes in container
                var container = document.getElementById('container_id');
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                 kchart = window.klinecharts.init(document.getElementById('container_id'), params.options);
               
                 window.ReactNativeWebView.postMessage('inited');

               
                 }`

        },
        setStyles: {
            native: (value: DeepPartial<Styles>) => {
                sendToWebView({
                    function: 'setStyles',
                    params: {
                        value: value,
                    }
                });
            },
            web: `
             if(functionName === 'setStyles') {
                 kchart.setStyles(params.value);
                }`
        },
        updateData: {
            native: (data: KLineData) => {
                sendToWebView({
                    function: 'updateData',
                    params: {
                        data: data,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'updateData') {
                 kchart.updateData(params.data);
                }`
        },
        applyNewData: {
            native: (dataList: KLineData[], more?: boolean | Partial<LoadDataMore>) => {
                sendToWebView({
                    function: 'applyNewData',
                    params: {
                        dataList: dataList,
                        more: more ?? false,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'applyNewData') {

           


                 kchart.applyNewData(params.dataList, params.more);
                }`
        },
        createIndicator: {
            native: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions) => {
                sendToWebView({
                    function: 'createIndicator',
                    params: {
                        value: value,
                        isStack: isStack ?? false,
                        paneOptions: paneOptions ?? undefined,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'createIndicator') {
                 kchart.createIndicator(params.value, params.isStack, params.paneOptions);
                }`
        },
        scrollByDistance: {
            native: (distance: number, animationDuration?: number) => {
                sendToWebView({
                    function: 'scrollByDistance',
                    params: {
                        distance: distance,
                        animationDuration: animationDuration ?? undefined,
                    }
                });
            },
            web: `
             if(functionName === 'scrollByDistance') {
                 kchart.scrollByDistance(params.distance, params.animationDuration);
                }`
        },
        scrollToRealTime: {
            native: (animationDuration?: number) => {
                sendToWebView({
                    function: 'scrollToRealTime',
                    params: {
                        animationDuration: animationDuration,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'scrollToRealTime') {
                 kchart.scrollToRealTime(params.animationDuration);
                }`
        },
        scrollToDataIndex: {
            native: (dataIndex: number, animationDuration?: number) => {
                sendToWebView({
                    function: 'scrollToDataIndex',
                    params: {
                        dataIndex: dataIndex,
                        animationDuration: animationDuration,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'scrollToDataIndex') {
                 kchart.scrollToDataIndex(params.dataIndex, params.animationDuration);
                }`
        },
        scrollToTimestamp: {
            native: (timestamp: number, animationDuration?: number) => {
                sendToWebView({
                    function: 'scrollToTimestamp',
                    params: {
                        timestamp: timestamp,
                        animationDuration: animationDuration,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'scrollToTimestamp') {
                 kchart.scrollToTimestamp(params.timestamp, params.animationDuration);
                }`
        },
        zoomAtCoordinate: {
            native: (scale: number, coordinate?: Coordinate, animationDuration?: number) => {
                sendToWebView({
                    function: 'zoomAtCoordinate',
                    params: {
                        scale: scale,
                        coordinate: coordinate,
                        animationDuration: animationDuration,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'zoomAtCoordinate') {
                 kchart.zoomAtCoordinate(params.scale, params.coordinate, params.animationDuration);
                }`
        },
        zoomAtDataIndex: {
            native: (scale: number, dataIndex: number, animationDuration?: number) => {
                sendToWebView({
                    function: 'zoomAtDataIndex',
                    params: {
                        scale: scale,
                        dataIndex: dataIndex,
                        animationDuration: animationDuration,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'zoomAtDataIndex') {
                 kchart.zoomAtDataIndex(params.scale, params.dataIndex, params.animationDuration);  
                }`
        },
        zoomAtTimestamp: {
            native: (scale: number, timestamp: number, animationDuration?: number) => {
                sendToWebView({
                    function: 'zoomAtTimestamp',
                    params: {
                        scale: scale,
                        timestamp: timestamp,
                        animationDuration: animationDuration,
                    }
                });
            }
            ,
            web: `
             if(functionName === 'zoomAtTimestamp') {
                 kchart.zoomAtTimestamp(params.scale, params.timestamp, params.animationDuration);
                }`
        },
        resize: {
            native: () => {
                sendToWebView({
                    function: 'resize',
                    params: {}
                });
            }
            ,
            web: `
             if(functionName === 'resize') {
                 kchart.resize();
                }`

        },

        removeIndicator: {
            native: (filter?: IndicatorFilter) => {
                sendToWebView({
                    function: 'removeIndicator',
                    params: {
                        filter: filter ?? undefined
                    }
                });
            },
            web: `
             if(functionName === 'removeIndicator') {
             if(params.filter)
                kchart.removeIndicator(params.filter);
             else
                kchart.removeIndicator();   
               
                }`

        }



    }


    useImperativeHandle(ref, () => ({
        removeIndicator: functionsMirror.removeIndicator.native,
        setPrecision: functionsMirror.setPrecision.native,
        setStyles: functionsMirror.setStyles.native,
        updateData: functionsMirror.updateData.native,
        applyNewData: functionsMirror.applyNewData.native,
        createIndicator: functionsMirror.createIndicator.native,
        scrollByDistance: functionsMirror.scrollByDistance.native,
        scrollToRealTime: functionsMirror.scrollToRealTime.native,
        scrollToDataIndex: functionsMirror.scrollToDataIndex.native,
        scrollToTimestamp: functionsMirror.scrollToTimestamp.native,
        zoomAtCoordinate: functionsMirror.zoomAtCoordinate.native,
        zoomAtDataIndex: functionsMirror.zoomAtDataIndex.native,
        zoomAtTimestamp: functionsMirror.zoomAtTimestamp.native,
        resize: functionsMirror.resize.native,
    }), [sendToWebView, webViewRef, props.options]);


    const [debugMessage, setDebugMessage] = useState<string>('');
    const [debugMessageCount, setDebugMessageCount] = useState<number>(0);

    useEffect(() => {
        if (props.debug) {
            setDebugMessageCount(prevCount => prevCount + 1);
        }
    }, [debugMessage]);

    return (<View style={props.style}>


        {props.debug && !!debugMessage && <Text
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                fontSize: 12,
                color: 'red',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
        >{debugMessageCount} {debugMessage}</Text>}

        <Animated.View style={{ flex: 1, opacity: inited && (props.fadeInOnInit ?? true) ? fadeAnim : 1 }}>
            <WebView
                ref={webViewRef}
                style={{
                    flex: 1,
                    backgroundColor: 'transparent'
                }}
                originWhitelist={['*']}
                source={{
                    html: html
                }}
                onLoadEnd={onLoadEnd}
                onMessage={event => {
                    const { data } = event.nativeEvent;
                    onReceiveMessageFromWebView(data);
                }}

                onError={props.onWebViewError}

                onTouchStart={props.onTouchStart}
                onTouchEnd={props.onTouchEnd}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                useWebKit={true}
                injectJavaScript={true}
            />
        </Animated.View>
    </View>
    );
});
