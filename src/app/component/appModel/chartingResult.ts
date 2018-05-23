import {GeoDataPoint } from './../appModel/geoDataPoint';

export interface ChartingResult {
    ref_no: string,
    titleHolder:string,
    streetName:string,
    cityName:string,
    town_village: string,
    surveyPlanNo: string,
    planInfoCoodinates: Array<GeoDataPoint>,
    total_no_overlap:number,
    feature_size: string,
    total_overlaping_size: string,
    total_percentage_overlap: string,
    total_size_free: string,
    acquisition_status: string,
    report_dataUrl: string,
    commitment_status?: string,
    dateCreated:string,
    surveyBy: string,
    date_of_survey: string,
    phoneNumber: string
}

export interface ChartingResultRef_Id extends ChartingResult {
    ref_id: string;
}