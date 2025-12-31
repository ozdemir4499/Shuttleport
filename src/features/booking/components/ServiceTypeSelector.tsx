'use client';

import { useState } from 'react';

export type ServiceType = 'transfer' | 'hourly' | 'tours';

interface ServiceTypeSelectorProps {
    defaultService?: ServiceType;
    onServiceChange?: (service: ServiceType) => void;
}

const serviceTypes = [
    {
        id: 'transfer' as ServiceType,
        label: 'Transfer',
        icon: '🚗',
    },
    {
        id: 'hourly' as ServiceType,
        label: 'Saatlik',
        icon: '⏱️',
    },
    {
        id: 'tours' as ServiceType,
        label: 'Turlar',
        icon: '🌍',
    },
];

export default function ServiceTypeSelector({
    defaultService = 'transfer',
    onServiceChange,
}: ServiceTypeSelectorProps) {
    const [activeService, setActiveService] = useState<ServiceType>(defaultService);

    const handleServiceChange = (service: ServiceType) => {
        setActiveService(service);
        onServiceChange?.(service);
    };

    return (
        <div className="service-type-selector">
            <div className="tabs">
                {serviceTypes.map((service) => (
                    <button
                        key={service.id}
                        className={`tab ${activeService === service.id ? 'active' : ''}`}
                        onClick={() => handleServiceChange(service.id)}
                        type="button"
                    >
                        <span className="tab-icon">{service.icon}</span>
                        <span className="tab-label">{service.label}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
        .service-type-selector {
          margin-bottom: var(--spacing-lg);
        }

        .tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--color-border-gray);
          background-color: var(--color-bg-secondary);
          border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
          overflow: hidden;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-secondary);
          background-color: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tab:hover {
          color: var(--color-text-primary);
          background-color: rgba(255, 255, 255, 0.5);
        }

        .tab.active {
          color: var(--color-text-primary);
          background-color: var(--color-bg-primary);
          border-bottom-color: var(--color-text-primary);
        }

        .tab-icon {
          font-size: 20px;
        }

        .tab-label {
          font-size: var(--font-size-button);
        }

        @media (max-width: 768px) {
          .tab {
            flex-direction: column;
            gap: 4px;
            padding: var(--spacing-sm) var(--spacing-md);
          }

          .tab-icon {
            font-size: 18px;
          }

          .tab-label {
            font-size: 12px;
          }
        }
      `}</style>
        </div>
    );
}
