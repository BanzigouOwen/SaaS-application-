package discovery

import (
	"fmt"
	"log"

	"collector/internal/mib"
)

// CustomVendorScanner handles dynamic MIB-based discovery
type CustomVendorScanner struct {
	templates map[string]*mib.MIBTemplate
}

func NewCustomVendorScanner() *CustomVendorScanner {
	return &CustomVendorScanner{
		templates: make(map[string]*mib.MIBTemplate),
	}
}

// RegisterCustomTemplate adds a custom MIB template
func (cvs *CustomVendorScanner) RegisterCustomTemplate(vendorKey string, template *mib.MIBTemplate) error {
	log.Printf("[CUSTOM-VENDOR] Registering template for %s (%s)\n", template.VendorName, vendorKey)
	cvs.templates[vendorKey] = template
	return nil
}

// ScanWithTemplate uses a custom MIB template to query device
func (cvs *CustomVendorScanner) ScanWithTemplate(host string, community string, vendorKey string) (map[string]interface{}, error) {
	template, exists := cvs.templates[vendorKey]
	if !exists {
		return nil, fmt.Errorf("template not found for vendor: %s", vendorKey)
	}

	result := make(map[string]interface{})
	result["vendor"] = template.VendorName
	result["model"] = template.ModelName
	result["template_name"] = vendorKey
	result["data"] = make(map[string]interface{})

	data := result["data"].(map[string]interface{})

	// Query each object in template
	for _, obj := range template.Objects {
		value, err := querySNMPObject(host, community, obj.OID)
		if err != nil {
			log.Printf("[CUSTOM-VENDOR] Failed to query %s.%s: %v\n", vendorKey, obj.Name, err)
			continue
		}

		data[obj.Name] = map[string]interface{}{
			"oid":   obj.OID,
			"value": value,
			"type":  obj.Type,
		}

		log.Printf("[CUSTOM-VENDOR] %s.%s = %v\n", vendorKey, obj.Name, value)
	}

	return result, nil
}

// GetAvailableFields returns all available fields from template
func (cvs *CustomVendorScanner) GetAvailableFields(vendorKey string) ([]map[string]interface{}, error) {
	template, exists := cvs.templates[vendorKey]
	if !exists {
		return nil, fmt.Errorf("template not found for vendor: %s", vendorKey)
	}

	var fields []map[string]interface{}
	for _, obj := range template.Objects {
		fields = append(fields, map[string]interface{}{
			"name":        obj.Name,
			"oid":         obj.OID,
			"type":        obj.Type,
			"access":      obj.Access,
			"description": obj.Description,
		})
	}

	log.Printf("[CUSTOM-VENDOR] Available fields for %s: %d\n", vendorKey, len(fields))
	return fields, nil
}

// CreateServiceFromTemplate creates monitoring service from template
func (cvs *CustomVendorScanner) CreateServiceFromTemplate(vendorKey string, selectedFields []string) (map[string]interface{}, error) {
	template, exists := cvs.templates[vendorKey]
	if !exists {
		return nil, fmt.Errorf("template not found for vendor: %s", vendorKey)
	}

	service := map[string]interface{}{
		"vendor_key":      vendorKey,
		"vendor_name":     template.VendorName,
		"model_name":      template.ModelName,
		"oid_prefix":      template.OIDPrefix,
		"selected_fields": []map[string]interface{}{},
	}

	// Filter objects based on selection
	selectedObjs := make(map[string]*mib.MIBObject)
	for _, obj := range template.Objects {
		for _, selected := range selectedFields {
			if obj.Name == selected || obj.OID == selected {
				selectedObjs[obj.Name] = &obj
				break
			}
		}
	}

	// Build service object
	selFields := []map[string]interface{}{}
	for _, obj := range selectedObjs {
		selFields = append(selFields, map[string]interface{}{
			"name":        obj.Name,
			"oid":         obj.OID,
			"type":        obj.Type,
			"description": obj.Description,
		})
	}
	service["selected_fields"] = selFields

	log.Printf("[CUSTOM-VENDOR] Created service for %s with %d fields\n", vendorKey, len(selectedObjs))
	return service, nil
}

// Helper function
func querySNMPObject(host, community, oid string) (interface{}, error) {
	// TODO: Implement actual SNMP query using gosnmp
	return "<SNMP Query Result>", nil
}
