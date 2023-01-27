export interface Customer {
        type: string,
        id: string,
        attributes: {
            tax_registration_number: string,
            business_name: string,
            contact_name: string,
            website: string,
            phone_number: string,
            mobile_number: string,
            email: any,
            observations: string,
            internal_observations: string,
            not_final_customer: boolean,
            cashed_vat: boolean,
            tax_country_region: string,
            country_iso_alpha_2: string,
            saft_import_id: any,
            is_tax_exempt: boolean,
            data: {

            }
        },
        relationships: {
            addresses: {
                data: [
                    {
                        type: any,
                        id: any
                    }
                ]
            },
            company: {
                data: {
                    type: string,
                    id: string
                }
            },
            defaults: {
                data: {
                    type: string,
                    id: string
                }
            },
            email_addresses: {
                data: []
            },
            main_address: {
                data: {
                    type: string,
                    id: string
                }
            },
            main_email_address: {
                data: boolean
            },
            tax_exemption_reason: {
                data: boolean
            }
        }
}