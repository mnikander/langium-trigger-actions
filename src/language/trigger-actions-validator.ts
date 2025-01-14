import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { TriggerActionsAstType, Person } from './generated/ast.js';
import type { TriggerActionsServices } from './trigger-actions-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: TriggerActionsServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.TriggerActionsValidator;
    const checks: ValidationChecks<TriggerActionsAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class TriggerActionsValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
