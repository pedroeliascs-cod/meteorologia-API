describe("beaches testes funcionais", () => {

    describe("quando criar a praia", () => {
        it("deve criar a praia com sucesso", async() => {
            const newBeach = {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: 'E'
            };
            const response = await global.testRequest.post("/beaches").send(newBeach);

            expect(response.status).toEqual(201);
            expect(response.body).toEqual(expect.objectContaining(newBeach));            

 
        })
    })



})