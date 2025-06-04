


export default interface Coordinate {
    x: number
    y: number
}


/**
 * line type
 */
export enum LineType {
    Dashed = 'dashed',
    Solid = 'solid'
}

export type FontBase64Type = {
    fontFamily: string,
    base64: string,
}

export interface LineStyle {
    style: LineType
    size: number
    color: string
    dashedValue: number[]
}

export interface StateLineStyle extends LineStyle {
    show: boolean
}

export interface GridStyle {
    show: boolean
    horizontal: StateLineStyle
    vertical: StateLineStyle
}


export enum CandleType {
    CandleSolid = 'candle_solid',
    CandleStroke = 'candle_stroke',
    CandleUpStroke = 'candle_up_stroke',
    CandleDownStroke = 'candle_down_stroke',
    Ohlc = 'ohlc',
    Area = 'area'
}


export interface ChangeColor {
    upColor: string
    downColor: string
    noChangeColor: string
}


export enum CandleColorCompareRule {
    CurrentOpen = 'current_open',
    PreviousClose = 'previous_close'
}


export interface CandleBarColor extends ChangeColor {
    compareRule: CandleColorCompareRule
    upBorderColor: string
    downBorderColor: string
    noChangeBorderColor: string
    upWickColor: string
    downWickColor: string
    noChangeWickColor: string
}

export interface GradientColor {
    offset: number
    color: string
}



export interface CandleAreaPointStyle {
    show: boolean
    color: string
    radius: number
    rippleColor: string
    rippleRadius: number
    animation: boolean
    animationDuration: number
}


export interface CandleAreaStyle {
    lineSize: number
    lineColor: string
    value: string
    smooth: boolean
    backgroundColor: string | GradientColor[]
    point: CandleAreaPointStyle
}


export interface Padding {
    paddingLeft: number
    paddingTop: number
    paddingRight: number
    paddingBottom: number
}


export enum PolygonType {
    Stroke = 'stroke',
    Fill = 'fill',
    StrokeFill = 'stroke_fill'
}

export interface TextStyle extends Padding {
    style: PolygonType
    color: string
    size: number
    family: string
    weight: number | string
    borderStyle: LineType
    borderDashedValue: number[]
    borderSize: number
    borderColor: string
    borderRadius: number | number[]
    backgroundColor: string
}

export interface CandleHighLowPriceMarkStyle {
    show: boolean
    color: string
    textOffset: number
    textSize: number
    textFamily: string
    textWeight: string
}

export interface StateTextStyle extends TextStyle {
    show: boolean
}

export type CandleLastPriceMarkLineStyle = Omit<StateLineStyle, 'color'>
export type LastValueMarkTextStyle = Omit<StateTextStyle, 'backgroundColor'>

export interface CandleLastPriceMarkStyle extends ChangeColor {
    show: boolean
    compareRule: CandleColorCompareRule
    line: CandleLastPriceMarkLineStyle
    text: LastValueMarkTextStyle
}


export interface CandlePriceMarkStyle {
    show: boolean
    high: CandleHighLowPriceMarkStyle
    low: CandleHighLowPriceMarkStyle
    last: CandleLastPriceMarkStyle
}


export enum TooltipShowRule {
    Always = 'always',
    FollowCross = 'follow_cross',
    None = 'none'
}

export enum TooltipShowType {
    Standard = 'standard',
    Rect = 'rect'
}

export interface Margin {
    marginLeft: number
    marginTop: number
    marginRight: number
    marginBottom: number
}


export type TooltipTextStyle = Pick<TextStyle, 'color' | 'size' | 'family' | 'weight'> & Margin



export enum TooltipFeatureType {
    Path = 'path',
    IconFont = 'icon_font'
}

export enum TooltipFeaturePosition {
    Left = 'left',
    Middle = 'middle',
    Right = 'right'
}



export enum PathType {
    Stroke = 'stroke',
    Fill = 'fill',
}

export interface PathStyle {
    style: PathType
    color: string
    lineWidth: number
}


export interface TooltipFeaturePathStyle extends Omit<PathStyle, 'color'> {
    path: string
}


export interface TooltipFeatureIconFontStyle {
    family: string
    content: string
}

export interface TooltipFeatureStyle extends Padding, Margin {
    id: string
    position: TooltipFeaturePosition
    backgroundColor: string
    activeBackgroundColor: string
    size: number
    color: string
    activeColor: string
    borderRadius: number | number[]
    type: TooltipFeatureType
    path: TooltipFeaturePathStyle
    iconFont: TooltipFeatureIconFontStyle
}

export interface TooltipStyle {
    showRule: TooltipShowRule
    showType: TooltipShowType
    defaultValue: string
    text: TooltipTextStyle
    features: TooltipFeatureStyle[]
}

export interface Offset {
    offsetLeft: number
    offsetTop: number
    offsetRight: number
    offsetBottom: number
}

export enum CandleTooltipRectPosition {
    Fixed = 'fixed',
    Pointer = 'pointer'
}

export interface CandleTooltipRectStyle extends Omit<RectStyle, 'style' | 'borderDashedValue' | 'borderStyle'>, Padding, Offset {
    position: CandleTooltipRectPosition
}

export interface TooltipLegendChild {
    text: string
    color: string
}

export interface TooltipLegend {
    title: string | TooltipLegendChild
    value: string | TooltipLegendChild
}

export interface CandleTooltipStyle extends TooltipStyle, Offset {
    custom: TooltipLegend[]
    rect: CandleTooltipRectStyle
}



export interface CandleStyle {
    type: CandleType
    bar: CandleBarColor
    area: CandleAreaStyle
    priceMark: CandlePriceMarkStyle
    tooltip: CandleTooltipStyle
}



export interface PolygonStyle {
    style: PolygonType
    color: string,
    borderColor: string
    borderSize: number
    borderStyle: LineType
    borderDashedValue: number[]
}


export type IndicatorPolygonStyle = Omit<PolygonStyle, 'color' | 'borderColor'> & ChangeColor

export interface SmoothLineStyle extends LineStyle {
    smooth: boolean | number
}


export interface IndicatorLastValueMarkStyle {
    show: boolean
    text: LastValueMarkTextStyle
}


export interface IndicatorStyle {
    ohlc: Pick<CandleBarColor, 'compareRule' | 'upColor' | 'downColor' | 'noChangeColor'>
    bars: IndicatorPolygonStyle[]
    lines: SmoothLineStyle[]
    circles: IndicatorPolygonStyle[]
    lastValueMark: IndicatorLastValueMarkStyle
    tooltip: IndicatorTooltipStyle
    [key: string]: unknown
}


export interface IndicatorTooltipStyle extends TooltipStyle, Offset {
    showName: boolean
    showParams: boolean
}

export type AxisLineStyle = Omit<StateLineStyle, 'style' | 'dashedValue'>


export interface AxisTickLineStyle extends AxisLineStyle {
    length: number
}

export interface AxisTickTextStyle extends Pick<StateTextStyle, 'show' | 'color' | 'weight' | 'family' | 'size'> {
    marginStart: number
    marginEnd: number
}


export interface AxisStyle {
    show: boolean
    size: number | 'auto'
    axisLine: AxisLineStyle
    tickLine: AxisTickLineStyle
    tickText: AxisTickTextStyle
}


export interface SeparatorStyle {
    size: number
    color: string
    fill: boolean
    activeBackgroundColor: string
}


export interface CrosshairDirectionStyle {
    show: boolean
    line: StateLineStyle
    text: StateTextStyle
}


export interface CrosshairStyle {
    show: boolean
    horizontal: CrosshairDirectionStyle
    vertical: CrosshairDirectionStyle
}

export interface RectStyle extends PolygonStyle {
    borderRadius: number | number[]
}

export interface OverlayPointStyle {
    color: string
    borderColor: string
    borderSize: number
    radius: number
    activeColor: string
    activeBorderColor: string
    activeBorderSize: number
    activeRadius: number
}


export interface OverlayStyle {
    point: OverlayPointStyle
    line: SmoothLineStyle
    rect: RectStyle
    polygon: PolygonStyle
    circle: PolygonStyle
    arc: LineStyle
    text: TextStyle
    [key: string]: unknown
}

export interface Styles {
    grid: GridStyle
    candle: CandleStyle
    indicator: IndicatorStyle
    xAxis: AxisStyle
    yAxis: AxisStyle
    separator: SeparatorStyle
    crosshair: CrosshairStyle
    overlay: OverlayStyle
}



export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer X>
    ? ReadonlyArray<DeepPartial<X>>
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

export enum FormatDateType {
    Tooltip,
    Crosshair,
    XAxis
}

export type FormatDate = (timestamp: number, format: string, type: FormatDateType) => string

export type FormatBigNumber = (value: string | number) => string

export interface CustomApi {
    formatDate: FormatDate
    formatBigNumber: FormatBigNumber
}

export interface Locales {
    time: string
    open: string
    high: string
    low: string
    close: string
    volume: string
    change: string
    turnover: string
    [key: string]: string
}

export const enum LayoutChildType {
    Candle = 'candle',
    Indicator = 'indicator',
    XAxis = 'xAxis'
}

type PickRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>


type ExcludePickPartial<T, K extends keyof T> = PickRequired<Partial<T>, K>


export enum IndicatorSeries {
    Normal = 'normal',
    Price = 'price',
    Volume = 'volume'
}



export interface IndicatorFigure {
    key: string
    title?: string
    type?: string
    baseValue?: number

}

type Nullable<T> = T | null

export interface Indicator<D = unknown, C = unknown, E = unknown> {
    /**
     * Unique id
     */
    id: string

    /**
     * Pane id
     */
    paneId: string

    /**
     * Indicator name
     */
    name: string

    /**
     * Short name, for display
     */
    shortName: string

    /**
     * Precision
     */
    precision: number

    /**
     * Calculation parameters
     */
    calcParams: C[]

    /**
     * Whether ohlc column is required
     */
    shouldOhlc: boolean

    /**
     * Whether large data values need to be formatted, starting from 1000, for example, whether 100000 needs to be formatted with 100K
     */
    shouldFormatBigNumber: boolean

    /**
     * Whether the indicator is visible
     */
    visible: boolean

    /**
     * Z index
     */
    zLevel: number

    /**
     * Extend data
     */
    extendData: E

    /**
     * Indicator series
     */
    series: IndicatorSeries

    /**
     * Figure configuration information
     */
    figures: Array<IndicatorFigure>

    /**
     * Specified minimum value
     */
    minValue: Nullable<number>

    /**
     * Specified maximum value
     */
    maxValue: Nullable<number>

    /**
     * Style configuration
     */
    styles: Nullable<DeepPartial<IndicatorStyle>>




    /**
     * Calculation result
     */
    result: D[]
}


export type IndicatorCreate<D = unknown, C = unknown, E = unknown> = ExcludePickPartial<Omit<Indicator<D, C, E>, 'result'>, 'name'>

export const enum PaneState {
    Normal = 'normal',
    Maximize = 'maximize',
    Minimize = 'minimize'
}




export interface KLineData {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume?: number
    turnover?: number
    [key: string]: unknown
}



export interface PaneOptions {
    id: string
    height?: number
    minHeight?: number
    dragEnabled?: boolean
    order?: number
    state?: PaneState,
    axis?: any
}


export interface LayoutChild {
    type: LayoutChildType
    content?: Array<string | IndicatorCreate>
    options?: PaneOptions
}

export interface DecimalFold {
    threshold: number
    format: (value: string | number) => string
}

export interface ThousandsSeparator {
    sign: string
    format: (value: string | number) => string
}

export interface Options {
    locale?: string
    timezone?: string
    styles?: DeepPartial<Styles>
    customApi?: Partial<CustomApi>
    thousandsSeparator?: Partial<ThousandsSeparator>
    decimalFold?: Partial<DecimalFold>
    layout?: LayoutChild[]
}


export enum LoadDataType {
    Init = 'init',
    Forward = 'forward',
    Backward = 'backward',
    Update = 'update'
}

export interface LoadDataMore {
    [LoadDataType.Backward]: boolean
    [LoadDataType.Forward]: boolean
}


export interface Precision {
    price: number
    volume: number
}
export type IndicatorFilter = Partial<Pick<Indicator, 'id' | 'paneId' | 'name'>>


export type KLineChartRef = {

    setPrecision: (precision: Partial<Precision>) => void,

    createIndicator: (value: string | IndicatorCreate, isStack?: boolean, paneOptions?: PaneOptions) => void,
    removeIndicator: (filter?: IndicatorFilter) => void,
    scrollByDistance: (distance: number, animationDuration?: number) => void
    scrollToRealTime: (animationDuration?: number) => void
    scrollToDataIndex: (dataIndex: number, animationDuration?: number) => void
    scrollToTimestamp: (timestamp: number, animationDuration?: number) => void
    zoomAtCoordinate: (scale: number, coordinate?: Coordinate, animationDuration?: number) => void
    zoomAtDataIndex: (scale: number, dataIndex: number, animationDuration?: number) => void
    zoomAtTimestamp: (scale: number, timestamp: number, animationDuration?: number) => void
    resize: () => void,
    applyNewData: (dataList: KLineData[], more?: boolean | Partial<LoadDataMore>) => void
    updateData: (data: KLineData) => void,
    setStyles: (value: DeepPartial<Styles>) => void

};