public static void MapAuthEndpoints(this IEndpointRouteBuilder app) {
    var group = app.MapGroup("/auth");
    group.MapPost("/login", LoginHandler);
}