namespace BudgetApp.Backend.Dto
{
    public enum ApiErrorCode
    {
        NeedOneParametersOnly = 100,
        NeedTwoParameters = 101,
        NoResultsReturned = 102,
        RequestNotAcknowledged = 103,
        UnableToReadDataProvided = 104,
        InvalidDataType = 110,
        InvalidProperty = 111,
        InvalidQueryStructure = 112,
        NoQueryProvided = 113,
        QueryRequiresComparisonType = 114,
        ItemCannotBeDeleted = 115,
        InvalidPropertyValue = 116,
        RequestCompleted = 200,
        UnexpectedError = 500
    }
}